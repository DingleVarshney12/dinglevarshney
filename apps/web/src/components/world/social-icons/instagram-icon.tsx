export const INSTAGRAM_ICON_MARKUP =
  '<rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><circle cx="17.5" cy="6.7" r="1.1" fill="currentColor"/>';

export function InstagramIcon({ size = 31 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: INSTAGRAM_ICON_MARKUP }}
    />
  );
}
