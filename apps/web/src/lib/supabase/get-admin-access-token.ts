import { createSupabaseBrowserClient } from "./client";

export async function getAdminAccessToken(): Promise<string> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase browser configuration is missing.");

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) {
    throw new Error("Your admin session expired. Sign in again to continue.");
  }

  return data.session.access_token;
}
