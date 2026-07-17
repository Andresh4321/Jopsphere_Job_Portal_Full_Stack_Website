/**
 * Resolves a backend image path (e.g. "/profile_images/uuid.png") to a
 * full URL that the browser can load.
 *
 * The backend stores relative paths starting with "/" in the database
 * (e.g. "/qualification_images/abc123.png"). These files are served by
 * Express.static from the backend's public folder. Since the frontend
 * runs on a different port (3000 vs 5000), we need to prepend the
 * backend origin.
 *
 * If the path is already a full URL (e.g. https://...), it's returned as-is.
 * If the path is empty/null/undefined, returns the fallback or empty string.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export function getBackendImageUrl(path: string | null | undefined, fallback?: string): string {
  if (!path) return fallback || '';

  // Already a full URL — cloud storage, CDN, etc.
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Relative path from backend (e.g. "/profile_images/uuid.png")
  // Ensure there's no double slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
}

/**
 * For qualification documents that might be PDFs — returns the URL
 * and whether it's likely an image vs a document.
 */
export function getDocumentInfo(path: string | null | undefined): { url: string; isImage: boolean; isPdf: boolean } {
  const url = getBackendImageUrl(path);
  if (!url) return { url: '', isImage: false, isPdf: false };

  const lower = url.toLowerCase();
  const isPdf = lower.endsWith('.pdf');
  const isImage = /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(lower);

  return { url, isImage, isPdf };
}
