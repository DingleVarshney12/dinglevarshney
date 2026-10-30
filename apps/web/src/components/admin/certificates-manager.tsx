"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Award, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createCertificate,
  deleteCertificate,
  getAdminCertificates,
  updateCertificate,
} from "@/api/certificate/certificate.api";
import type { Certificate, CertificateInput } from "@/api/certificate/certificate.type";
import { getAdminAccessToken } from "@/lib/supabase/get-admin-access-token";
import { ImageUploadField } from "./image-upload-field";

type CertificateDraft = {
  id?: string;
  title: string;
  issuer: string;
  credentialId: string;
  credentialUrl: string;
  imageUrl: string;
  issuedAt: string;
  expiresAt: string;
  isPublished: boolean;
  sortOrder: string;
};

const emptyDraft: CertificateDraft = {
  title: "",
  issuer: "",
  credentialId: "",
  credentialUrl: "",
  imageUrl: "",
  issuedAt: "",
  expiresAt: "",
  isPublished: false,
  sortOrder: "0",
};
const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]";

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function toDraft(certificate: Certificate): CertificateDraft {
  return {
    id: certificate.id,
    title: certificate.title,
    issuer: certificate.issuer,
    credentialId: certificate.credentialId ?? "",
    credentialUrl: certificate.credentialUrl ?? "",
    imageUrl: certificate.imageUrl ?? "",
    issuedAt: certificate.issuedAt?.slice(0, 10) ?? "",
    expiresAt: certificate.expiresAt?.slice(0, 10) ?? "",
    isPublished: certificate.isPublished,
    sortOrder: String(certificate.sortOrder ?? 0),
  };
}

function toInput(draft: CertificateDraft): CertificateInput {
  return {
    title: draft.title.trim(),
    issuer: draft.issuer.trim(),
    credentialId: draft.credentialId.trim() || null,
    credentialUrl: draft.credentialUrl.trim() || null,
    imageUrl: draft.imageUrl.trim() || null,
    issuedAt: draft.issuedAt || null,
    expiresAt: draft.expiresAt || null,
    isPublished: draft.isPublished,
    sortOrder: Number(draft.sortOrder) || 0,
  };
}

export function CertificatesManager() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [draft, setDraft] = useState<CertificateDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadCertificates() {
      try {
        const token = await getAdminAccessToken();
        const items = await getAdminCertificates(token);
        if (!cancelled) setCertificates(items);
      } catch (loadError) {
        if (!cancelled) setError(getMessage(loadError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void loadCertificates();
    return () => {
      cancelled = true;
    };
  }, []);

  function startNew() {
    setDraft({ ...emptyDraft });
    setError("");
    setNotice("");
  }
  function startEditing(certificate: Certificate) {
    setDraft(toDraft(certificate));
    setError("");
    setNotice("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setIsSaving(true);
    setError("");
    setNotice("");
    try {
      const token = await getAdminAccessToken();
      const input = toInput(draft);
      if (draft.id) await updateCertificate(draft.id, input, token);
      else await createCertificate(input, token);
      setCertificates(await getAdminCertificates(token));
      setDraft(null);
      setNotice(draft.id ? "Certificate updated." : "Certificate added.");
    } catch (saveError) {
      setError(getMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function remove(certificate: Certificate) {
    if (!window.confirm(`Delete “${certificate.title}”? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      const token = await getAdminAccessToken();
      await deleteCertificate(certificate.id, token);
      setCertificates((current) => current.filter((item) => item.id !== certificate.id));
      if (draft?.id === certificate.id) setDraft(null);
      setNotice("Certificate deleted.");
    } catch (deleteError) {
      setError(getMessage(deleteError));
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-[#ded6c7] bg-[#fffdf8] p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2a6355]">
            <Award size={15} /> Credentials
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#263432]">Certificates</h2>
          <p className="mt-1 text-sm text-[#68736c]">
            Add certificates when you have them ready. Published ones appear on your portfolio.
          </p>
        </div>
        {!draft && (
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-xl bg-[#244f45] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c4038]"
          >
            <Plus size={16} /> Add certificate
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}
      {draft && (
        <form
          onSubmit={save}
          className="mt-6 space-y-4 rounded-2xl border border-[#d7d5ca] bg-[#faf8f1] p-4 sm:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-[#263432]">
              {draft.id ? "Edit certificate" : "New certificate"}
            </h3>
            <button
              type="button"
              onClick={() => setDraft(null)}
              aria-label="Close certificate editor"
              className="rounded-lg p-2 text-[#68736c] hover:bg-black/5"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[#34413d]">
              Certificate title
              <input
                required
                maxLength={180}
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Issuer
              <input
                required
                maxLength={180}
                value={draft.issuer}
                onChange={(event) => setDraft({ ...draft, issuer: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Credential ID <span className="font-normal text-[#68736c]">(optional)</span>
              <input
                value={draft.credentialId}
                onChange={(event) => setDraft({ ...draft, credentialId: event.target.value })}
                placeholder="e.g. ABC123XYZ"
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Credential URL <span className="font-normal text-[#68736c]">(optional)</span>
              <input
                type="url"
                value={draft.credentialUrl}
                onChange={(event) => setDraft({ ...draft, credentialUrl: event.target.value })}
                placeholder="https://…"
                className={inputClass}
              />
            </label>
            <ImageUploadField
              label="Certificate image (optional)"
              value={draft.imageUrl}
              onChange={(imageUrl) => setDraft({ ...draft, imageUrl })}
              folder="certificates"
            />
            <label className="text-sm font-semibold text-[#34413d]">
              Issue date
              <input
                type="date"
                value={draft.issuedAt}
                onChange={(event) => setDraft({ ...draft, issuedAt: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Expiry date <span className="font-normal text-[#68736c]">(optional)</span>
              <input
                type="date"
                value={draft.expiresAt}
                onChange={(event) => setDraft({ ...draft, expiresAt: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="text-sm font-semibold text-[#34413d]">
              Display order
              <input
                type="number"
                min={0}
                value={draft.sortOrder}
                onChange={(event) => setDraft({ ...draft, sortOrder: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-[#34413d]">
              <input
                type="checkbox"
                checked={draft.isPublished}
                onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })}
                className="size-4 accent-[#244f45]"
              />{" "}
              Publish this certificate
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-[#244f45] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Check size={15} /> {isSaving ? "Saving…" : "Save certificate"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="rounded-full border border-[#d7d5ca] bg-white px-4 py-2.5 text-sm font-semibold text-[#34413d]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {isLoading ? (
        <p className="mt-6 text-sm text-[#68736c]">Loading certificates…</p>
      ) : certificates.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[#d7d5ca] p-6 text-sm text-[#68736c]">
          No certificates yet. Add one whenever you’re ready.
        </p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {certificates.map((certificate) => (
            <article
              key={certificate.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-[#e3dccd] bg-white p-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[#263432]">{certificate.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${certificate.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-[#f2ecdc] text-[#756744]"}`}
                  >
                    {certificate.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#68736c]">
                  {certificate.issuer}
                  {certificate.issuedAt ? ` · ${certificate.issuedAt.slice(0, 10)}` : ""}
                </p>
                {certificate.credentialId && (
                  <p className="mt-2 text-xs text-[#68736c]">
                    Credential ID:{" "}
                    <span className="font-mono font-semibold text-[#34413d]">
                      {certificate.credentialId}
                    </span>
                  </p>
                )}
                {certificate.credentialUrl && (
                  <a
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    title={certificate.credentialUrl}
                    className="mt-2 block break-all text-xs font-semibold leading-5 text-[#2a6355] underline underline-offset-2"
                  >
                    {certificate.credentialUrl}
                  </a>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => startEditing(certificate)}
                  aria-label={`Edit ${certificate.title}`}
                  className="rounded-lg p-2 text-[#2a6355] hover:bg-[#e7f0e9]"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => void remove(certificate)}
                  aria-label={`Delete ${certificate.title}`}
                  className="rounded-lg p-2 text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
