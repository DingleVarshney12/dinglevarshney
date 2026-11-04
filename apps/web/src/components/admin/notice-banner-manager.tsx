"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { getAdminNoticeBanner, saveNoticeBanner } from "@/api/notice-banner/notice-banner.api";
import type { NoticeBanner } from "@/api/notice-banner/notice-banner.type";
import { getAdminAccessToken } from "@/lib/supabase/get-admin-access-token";

const defaults: NoticeBanner = {
  isEnabled: false,
  text: "",
  linkLabel: "",
  linkUrl: "",
  backgroundColor: "#173b3a",
};
const field =
  "mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 outline-none focus:border-[#2a6355]";

export function NoticeBannerManager() {
  const [draft, setDraft] = useState(defaults);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let active = true;
    void getAdminAccessToken()
      .then(async (access) => {
        const data = await getAdminNoticeBanner(access);
        if (active) {
          setToken(access);
          if (data) setDraft(data);
        }
      })
      .catch((reason: unknown) => {
        if (active)
          setError(reason instanceof Error ? reason.message : "Could not load notice settings.");
      });
    return () => {
      active = false;
    };
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      setDraft(await saveNoticeBanner(draft, token));
      setSaved(true);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save notice.");
    }
  }
  return (
    <section className="mt-10 rounded-3xl border border-[#ded6c7] bg-[#fffdf8] p-5 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#2a6355]">
        Portfolio announcements
      </p>
      <h2 className="mt-2 font-serif text-2xl text-[#263432]">Notice banner</h2>
      <p className="mt-2 text-sm leading-6 text-[#68736c]">
        Post any announcement independently, such as a new video or project. It appears below the
        navigation.
      </p>
      <form onSubmit={(event) => void submit(event)} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
          <input
            type="checkbox"
            checked={draft.isEnabled}
            onChange={(event) => setDraft({ ...draft, isEnabled: event.target.checked })}
          />{" "}
          Show notice banner
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Banner text
          <input
            required
            maxLength={240}
            className={field}
            value={draft.text}
            onChange={(event) => setDraft({ ...draft, text: event.target.value })}
            placeholder="New video out now!"
          />
        </label>
        <label className="text-sm font-semibold">
          Link label
          <input
            maxLength={40}
            className={field}
            value={draft.linkLabel}
            onChange={(event) => setDraft({ ...draft, linkLabel: event.target.value })}
            placeholder="Watch now"
          />
        </label>
        <label className="text-sm font-semibold">
          Link URL
          <input
            maxLength={500}
            className={field}
            value={draft.linkUrl}
            onChange={(event) => setDraft({ ...draft, linkUrl: event.target.value })}
            placeholder="https://youtube.com/..."
          />
        </label>
        <label className="text-sm font-semibold">
          Banner color
          <input
            type="color"
            className={`${field} h-11 p-1`}
            value={draft.backgroundColor}
            onChange={(event) => setDraft({ ...draft, backgroundColor: event.target.value })}
          />
        </label>
        <div className="flex items-center gap-3">
          <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#204d49] px-5 py-2.5 text-sm font-semibold text-white">
            <Save size={16} /> Save banner
          </button>
          {saved && (
            <span role="status" className="mt-5 text-sm text-emerald-800">
              Saved
            </span>
          )}
        </div>
      </form>
      {error && (
        <p role="alert" className="mt-4 text-sm text-rose-700">
          {error}
        </p>
      )}
    </section>
  );
}
