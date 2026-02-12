// lib/url.ts
export function absoluteImageUrl(path?: string) {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
