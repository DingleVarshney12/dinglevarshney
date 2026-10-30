"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, Mail, MailCheck, MessageSquareText } from "lucide-react";
import {
  getAdminContactMessages,
  updateContactMessageStatus,
} from "@/api/contact-message/contact-message.api";
import type {
  ContactMessage,
  ContactMessageStatus,
} from "@/api/contact-message/contact-message.type";
import { getAdminAccessToken } from "@/lib/supabase/get-admin-access-token";

type InboxFilter = "all" | ContactMessageStatus;
const statusOptions: ContactMessageStatus[] = ["new", "read", "replied", "archived"];

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}
function getReplyUrl(message: ContactMessage) {
  const params = new URLSearchParams({
    subject: `Re: Your message to ${"Dingle Varshney"}`,
    body: `Hi ${message.name},\n\n`,
  });
  return `mailto:${message.email}?${params.toString()}`;
}

export function ContactInbox() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadMessages() {
      try {
        const token = await getAdminAccessToken();
        const items = await getAdminContactMessages(token);
        if (!cancelled) setMessages(items);
      } catch (loadError) {
        if (!cancelled) setError(getMessage(loadError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void loadMessages();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleMessages = useMemo(
    () => (filter === "all" ? messages : messages.filter((message) => message.status === filter)),
    [filter, messages],
  );
  const newCount = messages.filter((message) => message.status === "new").length;

  async function changeStatus(message: ContactMessage, status: ContactMessageStatus) {
    setError("");
    setNotice("");
    setUpdatingId(message.id);
    try {
      const token = await getAdminAccessToken();
      const updated = await updateContactMessageStatus(message.id, status, token);
      setMessages((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setNotice(`Message marked ${status}.`);
    } catch (updateError) {
      setError(getMessage(updateError));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-[#ded6c7] bg-[#fffdf8] p-5 shadow-sm sm:p-7">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2a6355]">
            <Mail size={15} /> Visitor messages
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#263432]">Contact inbox</h2>
          <p className="mt-1 text-sm text-[#68736c]">
            Read messages and reply from your email app.{newCount > 0 ? ` ${newCount} new.` : ""}
          </p>
        </div>
        <label className="text-xs font-semibold text-[#59665f]">
          Show
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as InboxFilter)}
            className="ml-2 rounded-full border border-[#d7d5ca] bg-white px-3 py-2 text-sm capitalize text-[#34413d]"
          >
            {["all", ...statusOptions].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </header>
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
      {isLoading ? (
        <p className="mt-6 text-sm text-[#68736c]">Loading messages…</p>
      ) : visibleMessages.length === 0 ? (
        <div className="mt-6 grid justify-items-center rounded-2xl border border-dashed border-[#d7d5ca] px-5 py-12 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#e7f0e9] text-[#2a6355]">
            <MessageSquareText size={22} />
          </span>
          <p className="mt-4 font-semibold text-[#34413d]">
            {filter === "all" ? "Your inbox is empty" : `No ${filter} messages`}
          </p>
          <p className="mt-1 text-sm text-[#68736c]">
            Messages submitted through the portfolio contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {visibleMessages.map((message) => (
            <article
              key={message.id}
              className={`rounded-2xl border p-4 sm:p-5 ${message.status === "new" ? "border-[#b9cfc0] bg-[#f8fcf8]" : "border-[#e3dccd] bg-white"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[#263432]">{message.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${message.status === "new" ? "bg-emerald-100 text-emerald-800" : message.status === "archived" ? "bg-slate-100 text-slate-600" : "bg-[#f2ecdc] text-[#756744]"}`}
                    >
                      {message.status}
                    </span>
                  </div>
                  <a
                    className="mt-1 inline-block text-sm font-medium text-[#2a6355] hover:underline"
                    href={`mailto:${message.email}`}
                  >
                    {message.email}
                  </a>
                  <p className="mt-1 text-xs text-[#89918a]">{formatDate(message.createdAt)}</p>
                </div>
                <a
                  href={getReplyUrl(message)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#244f45] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1c4038]"
                >
                  <MailCheck size={15} /> Reply by email
                </a>
              </div>
              <p className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-[#f7f5ee] p-4 text-sm leading-6 text-[#44514a]">
                {message.message}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <label className="text-xs font-semibold text-[#68736c]">
                  Status
                  <select
                    value={message.status}
                    disabled={updatingId === message.id}
                    onChange={(event) =>
                      void changeStatus(message, event.target.value as ContactMessageStatus)
                    }
                    className="ml-2 rounded-full border border-[#d7d5ca] bg-white px-3 py-1.5 text-xs capitalize text-[#34413d] disabled:opacity-50"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                {message.status !== "archived" && (
                  <button
                    type="button"
                    onClick={() => void changeStatus(message, "archived")}
                    disabled={updatingId === message.id}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#68736c] transition hover:bg-[#f2ecdc] disabled:opacity-50"
                  >
                    <Archive size={13} /> Archive
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
