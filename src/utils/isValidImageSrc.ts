// Utility to validate image source strings before passing to next/image
// Accepts: http(s) URLs, protocol-relative (//), root-relative (/), data URIs, and existing public file paths
// Rejects placeholders like '-', empty strings, whitespace, or undefined/null
export function isValidImageSrc(src?: string | null): src is string {
  if (!src) return false;
  const trimmed = src.trim();
  if (!trimmed) return false;
  if (trimmed === '-' || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') return false;
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:')
  ) {
    return true;
  }
  return false;
}
