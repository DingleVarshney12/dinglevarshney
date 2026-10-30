import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminAccessDenied } from "@/components/admin/admin-access-denied";
import { AdminLogin } from "@/components/admin/admin-login";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Private admin panel | Dingle Varshney",
    template: "%s | Admin | Dingle Varshney",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const supabase = await createSupabaseServerClient();
  const configured = Boolean(
    supabase &&
    adminEmail &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );

  if (!supabase) return <AdminLogin configured={false} />;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <AdminLogin configured={configured} />;

  if (!adminEmail || user.email?.trim().toLowerCase() !== adminEmail) {
    return <AdminAccessDenied />;
  }

  return children;
}
