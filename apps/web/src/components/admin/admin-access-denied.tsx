"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AdminAccessDenied() {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase?.auth.signOut();
    router.refresh();
  }

  return (
    <main className="grid min-h-[75vh] place-items-center bg-[#f4f0e7] px-4 py-12">
      <section className="max-w-md rounded-3xl border border-[#ded6c7] bg-[#fffdf8] p-8 text-center shadow-xl">
        <p className="font-serif text-2xl text-[#263432]">
          This account can’t access the admin panel.
        </p>
        <button
          type="button"
          onClick={signOut}
          className="mt-6 rounded-xl bg-[#244f45] px-5 py-3 font-semibold text-white hover:bg-[#1c4038]"
        >
          Sign out
        </button>
      </section>
    </main>
  );
}
