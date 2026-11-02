"use client";

import { instagramHref, youtubeHref } from "@/lib/social";
import { useStore } from "@/lib/store";

export function PublicSocialLinks({
  className = "grid gap-2",
  linkClassName = "rounded-full border border-rose px-4 py-3 text-center text-sm font-semibold text-rose",
}: {
  className?: string;
  linkClassName?: string;
}) {
  const { settings } = useStore();
  const instagram = instagramHref(settings.instagram);
  const youtube = youtubeHref(settings.youtube);

  return (
    <div className={className}>
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
