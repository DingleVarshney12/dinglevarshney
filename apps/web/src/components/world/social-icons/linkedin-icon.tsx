export const LINKEDIN_ICON_MARKUP =
  '<rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="9" r="1.15" fill="currentColor"/><path d="M7 11.2h2v5.8H7zm3.6 0h1.9v.8c.5-.7 1.1-1 2-1 1.8 0 2.5 1.1 2.5 3v3h-2v-2.7c0-1-.2-1.7-1.2-1.7-.9 0-1.3.6-1.3 1.7v2.7h-1.9z" fill="currentColor"/>';

export function LinkedinIcon({ size = 31 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: LINKEDIN_ICON_MARKUP }}
    />
  );
}
