"use client";

import { BRAND } from "@/lib/brand";
import { digitsOnly, waLink } from "@/lib/format";
import { instagramHref, youtubeHref } from "@/lib/social";
import { useStore } from "@/lib/store";

export function PublicContactLinks({
  className = "grid gap-2",
  linkClassName = "rounded-full border border-rose px-4 py-3 text-center text-sm font-semibold text-rose",
}: {
  className?: string;
  linkClassName?: string;
}) {
  const { settings } = useStore();
  const phone = (settings.phone || "").trim() || BRAND.phone;
  const whatsapp = (settings.whatsapp || "").trim() || BRAND.whatsapp;
  const instagram = instagramHref(settings.instagram);
  const youtube = youtubeHref(settings.youtube);
  const tel = digitsOnly(phone);

  return (
    <div className={className}>
      {tel ? (
        <a href={`tel:${tel}`} className={linkClassName}>
          Phone
        </a>
      ) : null}
      {digitsOnly(whatsapp) ? (
        <a
          href={waLink(whatsapp, `Hi ${settings.brand_name || BRAND.name}, I have a question.`)}
          className={linkClassName}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      ) : null}
      {instagram ? (
        <a href={instagram} className={linkClassName} target="_blank" rel="noreferrer">
          Instagram
        </a>
      ) : null}
      {youtube ? (
        <a href={youtube} className={linkClassName} target="_blank" rel="noreferrer">
          YouTube
        </a>
      ) : null}
    </div>
  );
}
