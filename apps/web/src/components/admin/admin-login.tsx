"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LockKeyhole } from "lucide-react";

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase login is not configured yet.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Email or password is incorrect.");
      setIsSubmitting(false);
      return;
    }

    router.refresh();
  }

  return (
    <main className="grid min-h-[75vh] place-items-center bg-[#f4f0e7] px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-[#ded6c7] bg-[#fffdf8] p-7 shadow-xl sm:p-9">
        <div className="mb-6 grid size-12 place-items-center rounded-2xl bg-[#e7f0e9] text-[#2a6355]">
          <LockKeyhole size={22} />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2a6355]">
          Private workspace
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#263432]">Admin sign in</h1>
        <p className="mt-2 text-sm leading-6 text-[#68736c]">
          Sign in with the portfolio owner account to manage the site.
        </p>

        {!configured ? (
          <div className="mt-6 rounded-2xl border border-[#e8d8b2] bg-[#fff8e8] p-4 text-sm leading-6 text-[#725d31]">
            Add the Supabase URL, anon key, and admin email to
            <code className="mx-1 rounded bg-black/5 px-1.5 py-0.5">apps/web/.env.local</code>
            before signing in. See <code>apps/web/.env.example</code> for the required names.
          </div>
        ) : (
          <form className="mt-7 space-y-4" onSubmit={signIn}>
            <label className="block text-sm font-semibold text-[#34413d]">
              Email
              <input
                required
                autoComplete="username"
                type="email"
                name="email"
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-4 py-3 font-normal outline-none transition focus:border-[#2a6355] focus:ring-2 focus:ring-[#2a6355]/15"
              />
            </label>
            <label className="block text-sm font-semibold text-[#34413d]">
              Password
              <input
                required
                autoComplete="current-password"
                type="password"
                name="password"
                className="mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-4 py-3 font-normal outline-none transition focus:border-[#2a6355] focus:ring-2 focus:ring-[#2a6355]/15"
              />
            </label>
            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#244f45] px-4 py-3 font-semibold text-white transition hover:bg-[#1c4038] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
