"use client";

import { waLink } from "@/lib/format";
import { useStore } from "@/lib/store";

export function WhatsAppFloat() {
  const { settings } = useStore();
  const href = waLink(
    settings.whatsapp,
    `Hi ${settings.brand_name}, I would like to know more about your collections.`,
  );
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="no-print fixed right-4 bottom-4 z-50 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg"
    >
      WhatsApp
    </a>
  );
}
