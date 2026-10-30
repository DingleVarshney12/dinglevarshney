"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Link2, Plus, Save, Trash2 } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@dinglevarshney/shared";
import {
  getAdminPortfolioProfile,
  saveAdminPortfolioProfile,
} from "@/api/portfolio-profile/portfolio-profile.api";
import type { AdminPortfolioProfile } from "@/api/portfolio-profile/portfolio-profile.type";
import { getAdminAccessToken } from "@/lib/supabase/get-admin-access-token";
import { ImageUploadField } from "./image-upload-field";

type ProfileDraft = Omit<AdminPortfolioProfile, "id" | "updatedAt">;

const emptyDraft: ProfileDraft = {
  name: "",
  headline: "",
  shortBio: "",
  about: "",
  avatarUrl: "",
  location: "",
  email: "",
  phone: "",
  resumeUrl: "",
  socialLinks: [],
  isPublished: false,
};

const socialPlatforms: SocialPlatform[] = [
  "github",
  "linkedin",
  "instagram",
  "youtube",
  "x",
  "website",
  "leetcode",
  "other",
];
const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]";

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Could not save the profile. Please try again.";
}

function toDraft(profile: AdminPortfolioProfile | null): ProfileDraft {
  if (!profile) return { ...emptyDraft, socialLinks: [] };
  return {
    name: profile.name,
    headline: profile.headline,
    shortBio: profile.shortBio,
    about: profile.about,
    avatarUrl: profile.avatarUrl ?? "",
    location: profile.location ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    resumeUrl: profile.resumeUrl ?? "",
    socialLinks: profile.socialLinks ?? [],
    isPublished: profile.isPublished,
  };
}

export function ProfileManager() {
  const [draft, setDraft] = useState<ProfileDraft>({ ...emptyDraft, socialLinks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        const token = await getAdminAccessToken();
        const profile = await getAdminPortfolioProfile(token);
        if (!cancelled) setDraft(toDraft(profile));
      } catch (loadError) {
        if (!cancelled) setError(getMessage(loadError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateField<Key extends keyof ProfileDraft>(key: Key, value: ProfileDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateSocialLink(index: number, changes: Partial<SocialLink>) {
    setDraft((current) => ({
      ...current,
      socialLinks: current.socialLinks.map((link, linkIndex) =>
        linkIndex === index ? { ...link, ...changes } : link,
      ),
    }));
  }

  function addSocialLink() {
    setDraft((current) => ({
      ...current,
      socialLinks: [
        ...current.socialLinks,
        {
          id: crypto.randomUUID(),
          label: "GitHub",
          platform: "github",
          url: "",
          sortOrder: current.socialLinks.length,
        },
      ],
    }));
  }

  function removeSocialLink(id: string) {
    setDraft((current) => ({
      ...current,
      socialLinks: current.socialLinks.filter((link) => link.id !== id),
    }));
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSaving(true);
    try {
      const token = await getAdminAccessToken();
      const saved = await saveAdminPortfolioProfile(
        {
          ...draft,
          avatarUrl: draft.avatarUrl?.trim() || null,
          location: draft.location?.trim() || null,
          email: draft.email?.trim() || null,
          phone: draft.phone?.trim() || null,
          resumeUrl: draft.resumeUrl?.trim() || null,
          socialLinks: draft.socialLinks.map((link, sortOrder) => ({ ...link, sortOrder })),
        },
        token,
      );
      setDraft(toDraft(saved));
      setNotice("Profile saved.");
    } catch (saveError) {
      setError(getMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#ded6c7] bg-[#fffdf8] p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#2a6355]">
            Your public identity
          </p>
          <h2 className="mt-1 font-serif text-2xl text-[#263432]">Profile & social links</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68736c]">
            These details appear on both portfolio views. Keep the profile as a draft until you are
            happy with it.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f0e9] px-3 py-1.5 text-xs font-semibold text-[#2a6355]">
          <Link2 size={14} /> Public profile
        </span>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-[#68736c]">Loading profile…</p>
      ) : (
        <form onSubmit={saveProfile} className="mt-6 grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[#34413d]">
              Name
              <input
                required
                maxLength={120}
                value={draft.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Headline
              <input
                required
                maxLength={180}
                value={draft.headline}
                onChange={(event) => updateField("headline", event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Location
              <input
                value={draft.location ?? ""}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder="Optional"
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Contact email
              <input
                type="email"
                value={draft.email ?? ""}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="Optional"
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Phone number
              <input
                type="tel"
                value={draft.phone ?? ""}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="Optional"
                className={inputClass}
              />
            </label>
            <ImageUploadField
              label="Profile image (optional)"
              value={draft.avatarUrl ?? ""}
              onChange={(avatarUrl) => updateField("avatarUrl", avatarUrl)}
              folder="profile"
            />
            <label className="text-sm font-semibold text-[#34413d]">
              Existing resume link (optional)
              <input
                type="url"
                value={draft.resumeUrl ?? ""}
                onChange={(event) => updateField("resumeUrl", event.target.value)}
                placeholder="Optional older PDF link"
                className={inputClass}
              />
            </label>
          </div>
          <label className="text-sm font-semibold text-[#34413d]">
            Short introduction
            <textarea
              required
              rows={3}
              maxLength={500}
              value={draft.shortBio}
              onChange={(event) => updateField("shortBio", event.target.value)}
              className={`${inputClass} leading-6`}
            />
          </label>
          <label className="text-sm font-semibold text-[#34413d]">
            About me
            <textarea
              required
              rows={6}
              value={draft.about}
              onChange={(event) => updateField("about", event.target.value)}
              className={`${inputClass} leading-6`}
            />
          </label>

          <div className="rounded-xl border border-[#e3dccd] bg-[#faf8f1] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-[#34413d]">Social links</h3>
                <p className="mt-1 text-xs text-[#68736c]">
                  All links appear in the classic view. GitHub, LinkedIn, and Instagram also appear
                  on the 3D room wall.
                </p>
              </div>
              <button
                type="button"
                onClick={addSocialLink}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#b9cfc0] bg-white px-3 py-2 text-xs font-semibold text-[#2a6355] hover:bg-[#e7f0e9]"
              >
                <Plus size={14} /> Add link
              </button>
            </div>
            {draft.socialLinks.length === 0 ? (
              <p className="mt-4 text-sm text-[#68736c]">No social links added yet.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {draft.socialLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="grid gap-2 rounded-xl bg-white p-3 sm:grid-cols-[1fr_1fr_1.5fr_auto] sm:items-end"
                  >
                    <label className="text-xs font-semibold text-[#59665f]">
                      Label
                      <input
                        required
                        value={link.label}
                        onChange={(event) => updateSocialLink(index, { label: event.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#d7d5ca] px-3 py-2 text-sm font-normal outline-none focus:border-[#2a6355]"
                      />
                    </label>
                    <label className="text-xs font-semibold text-[#59665f]">
                      Platform
                      <select
                        value={link.platform}
                        onChange={(event) =>
                          updateSocialLink(index, {
                            platform: event.target.value as SocialPlatform,
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-[#d7d5ca] bg-white px-3 py-2 text-sm font-normal capitalize outline-none focus:border-[#2a6355]"
                      >
                        {socialPlatforms.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-[#59665f]">
                      URL
                      <input
                        required
                        type="url"
                        value={link.url}
                        onChange={(event) => updateSocialLink(index, { url: event.target.value })}
                        placeholder="https://…"
                        className="mt-1 w-full rounded-lg border border-[#d7d5ca] px-3 py-2 text-sm font-normal outline-none focus:border-[#2a6355]"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSocialLink(link.id)}
                      aria-label={`Remove ${link.label}`}
                      className="justify-self-end rounded-lg p-2 text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-[#34413d]">
            <input
              type="checkbox"
              checked={draft.isPublished}
              onChange={(event) => updateField("isPublished", event.target.checked)}
              className="size-4 accent-[#244f45]"
            />{" "}
            Publish this profile on the portfolio
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-[#244f45] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1c4038] disabled:opacity-50"
            >
              <Save size={15} /> {isSaving ? "Saving…" : "Save profile"}
            </button>
            {notice && (
              <p role="status" className="text-sm font-medium text-emerald-800">
                {notice}
              </p>
            )}
            {error && (
              <p role="alert" className="text-sm font-medium text-rose-700">
                {error}
              </p>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
