import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";

type SupabaseUser = { email?: string };
type AdminRequest = { headers: { authorization?: string } };

@Injectable()
export class SupabaseAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!supabaseUrl || !supabaseKey || !adminEmail) {
      throw new ServiceUnavailableException(
        "Admin API auth is not configured. Set Supabase URL, publishable key, and ADMIN_EMAIL in apps/api/.env.",
      );
    }

    const request = context.switchToHttp().getRequest<AdminRequest>();
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("A Supabase access token is required.");
    }

    let response: Response;
    try {
      response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`, {
        headers: {
          apikey: supabaseKey,
          Authorization: authorization,
        },
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      throw new ServiceUnavailableException("Supabase authentication could not be reached.");
    }

    if (!response.ok) {
      throw new UnauthorizedException("The Supabase session is invalid or expired.");
    }

    const user = (await response.json()) as SupabaseUser;
    if (user.email?.trim().toLowerCase() !== adminEmail) {
      throw new ForbiddenException("This account cannot manage portfolio content.");
    }

    return true;
  }
}
