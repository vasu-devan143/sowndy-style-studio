import { BRAND } from "./brand";

export function instagramHref(value: string) {
  const raw = (value || "").trim() || BRAND.instagram;
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://www.instagram.com/${raw.replace(/^@/, "")}`;
}

export function youtubeHref(value: string) {
  const raw = (value || "").trim() || BRAND.youtube;
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://www.youtube.com/${raw.replace(/^@/, "@")}`;
}
