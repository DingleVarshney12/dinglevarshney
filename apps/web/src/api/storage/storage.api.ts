import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { PortfolioImageFolder, UploadPortfolioImageInput } from "./storage.type";

const BUCKET = "portfolio-assets";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function uploadPortfolioImage({
  file,
  folder,
}: UploadPortfolioImageInput): Promise<string> {
  const extension = EXTENSIONS[file.type];
  if (!extension) throw new Error("Choose a JPG, PNG, WebP, or GIF image.");
  if (file.size > MAX_FILE_SIZE) throw new Error("Image must be 10 MB or smaller.");

  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase browser configuration is missing.");

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user)
    throw new Error("Sign in to the admin panel before uploading an image.");

  const path = `${userData.user.id}/${folder}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    if (uploadError.message.toLowerCase().includes("row-level security")) {
      throw new Error(
        "Storage upload was blocked. Sign out and back into the admin panel, then try again.",
      );
    }
    throw new Error(uploadError.message || "Could not upload this image.");
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export type { PortfolioImageFolder };
