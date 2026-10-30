"use client";

import Image from "next/image";
import { useId, useState, type ChangeEvent } from "react";
import { LoaderCircle, Trash2, Upload } from "lucide-react";
import { uploadPortfolioImage } from "@/api/storage/storage.api";
import type { PortfolioImageFolder } from "@/api/storage/storage.type";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: PortfolioImageFolder;
  multiple?: boolean;
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#d7d5ca] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#2a6355]";

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  multiple = false,
}: ImageUploadFieldProps) {
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const urls = value
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);

  async function handleSelection(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    if (!files.length) return;
    setError("");
    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of multiple ? files : files.slice(0, 1)) {
        uploaded.push(await uploadPortfolioImage({ file, folder }));
      }
      onChange(multiple ? [...urls, ...uploaded].join("\n") : uploaded[0]);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Image upload failed. Try again.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function removeImage(url: string) {
    const remaining = urls.filter((item) => item !== url);
    onChange(multiple ? remaining.join("\n") : "");
  }

  return (
    <div className="sm:col-span-2">
      <label htmlFor={inputId} className="block text-sm font-semibold text-[#34413d]">
        {label}
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          disabled={isUploading}
          onChange={(event) => void handleSelection(event)}
          className="sr-only"
        />
        <label
          htmlFor={inputId}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#b9cfc0] bg-white px-4 py-2.5 text-sm font-semibold text-[#2a6355] transition hover:bg-[#e7f0e9] ${isUploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {isUploading ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
          {isUploading ? "Uploading…" : multiple ? "Upload images" : "Upload image"}
        </label>
        <span className="text-xs text-[#68736c]">JPG, PNG, WebP, or GIF · up to 10 MB each</span>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-rose-700">
          {error}
        </p>
      )}
      {multiple ? (
        <textarea
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Uploaded image URLs appear here (one per line). You can also paste URLs."
          className={`${inputClass} resize-y text-sm`}
        />
      ) : (
        <input
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Upload an image or paste an image URL"
          className={`${inputClass} text-sm`}
        />
      )}
      {urls.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {urls.map((url) => (
            <div
              key={url}
              className="group relative size-20 overflow-hidden rounded-xl border border-[#d7d5ca] bg-white"
            >
              <Image
                src={url}
                alt="Uploaded portfolio image"
                width={80}
                height={80}
                unoptimized
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                aria-label="Remove image from this entry"
                className="absolute right-1 top-1 rounded-full bg-white/95 p-1 text-rose-700 shadow-sm opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
