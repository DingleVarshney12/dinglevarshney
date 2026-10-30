"use client";

import type { RefObject } from "react";
import {
  Bold,
  Code2,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";

type Props = {
  value: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
};

const buttonClass =
  "inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#d7d5ca] bg-white px-2.5 text-xs font-semibold text-[#34413d] transition hover:border-[#96b9a8] hover:bg-[#f8fcf8]";

export function ChapterFormattingToolbar({ value, textareaRef, onChange }: Props) {
  function replaceSelection(
    replacement: string,
    selectionStart: number,
    selectionEnd: number,
    rangeStart: number,
    rangeEnd: number,
  ) {
    const textarea = textareaRef.current;
    const content = `${value.slice(0, rangeStart)}${replacement}${value.slice(rangeEnd)}`;
    onChange(content);
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  function wrapSelection(open: string, close = open, placeholder = "text") {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || placeholder;
    const replacement = `${open}${selected}${close}`;
    const selectionStart = start + open.length;
    replaceSelection(replacement, selectionStart, selectionStart + selected.length, start, end);
  }

  function prefixCurrentLine(prefix: string) {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const line = value.slice(
      lineStart,
      value.indexOf("\n", start) < 0 ? value.length : value.indexOf("\n", start),
    );
    const actualPrefix = line.startsWith(prefix) ? "" : prefix;
    replaceSelection(
      actualPrefix,
      start + actualPrefix.length,
      end + actualPrefix.length,
      lineStart,
      lineStart,
    );
  }

  function insertLink() {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || "link text";
    const replacement = `[${selected}](https://example.com)`;
    const urlStart = start + selected.length + 3;
    replaceSelection(replacement, urlStart, urlStart + "https://example.com".length, start, end);
  }

  function insertDivider() {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const before = value.slice(0, start);
    const prefix = before && !before.endsWith("\n") ? "\n" : "";
    const replacement = `${prefix}---\n`;
    const cursor = start + replacement.length;
    replaceSelection(replacement, cursor, cursor, start, end);
  }

  return (
    <div className="mt-1.5 rounded-t-xl border border-b-0 border-[#d7d5ca] bg-[#f4f0e7] p-2">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => wrapSelection("**")}
          title="Bold"
          className={buttonClass}
        >
          <Bold size={14} /> Bold
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("*")}
          title="Italic"
          className={buttonClass}
        >
          <Italic size={14} /> Italic
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("__")}
          title="Underline"
          className={buttonClass}
        >
          <Underline size={14} /> Underline
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("~~")}
          title="Strikethrough"
          className={buttonClass}
        >
          <Strikethrough size={14} /> Strike
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("`")}
          title="Inline code"
          className={buttonClass}
        >
          <Code2 size={14} /> Code
        </button>
        <button type="button" onClick={insertLink} title="Insert link" className={buttonClass}>
          <Link2 size={14} /> Link
        </button>
        <span className="mx-1 hidden h-8 w-px bg-[#d7d5ca] sm:block" />
        <button
          type="button"
          onClick={() => prefixCurrentLine("## ")}
          title="Heading"
          className={buttonClass}
        >
          <Heading2 size={14} /> Heading
        </button>
        <button
          type="button"
          onClick={() => prefixCurrentLine("> ")}
          title="Quote"
          className={buttonClass}
        >
          <Quote size={14} /> Quote
        </button>
        <button
          type="button"
          onClick={() => prefixCurrentLine("- ")}
          title="Bullet list"
          className={buttonClass}
        >
          <List size={14} /> Bullets
        </button>
        <button
          type="button"
          onClick={() => prefixCurrentLine("1. ")}
          title="Numbered list"
          className={buttonClass}
        >
          <ListOrdered size={14} /> Numbered
        </button>
        <button type="button" onClick={insertDivider} title="Divider" className={buttonClass}>
          <Minus size={14} /> Divider
        </button>
      </div>
      <p className="mt-2 px-1 text-[11px] leading-5 text-[#68736c]">
        Select text before formatting. Press Enter for a line break; links open in a new tab.
      </p>
    </div>
  );
}
