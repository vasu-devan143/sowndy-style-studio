/** Single place to change the boutique name and default contact details. */
export const BRAND = {
  name: "SOWNDY STYLE STUDIO",
  tagline: "Elegant ethnic wear, made simple to shop",
  phone: "9000000000",
  whatsapp: "919000000000",
  instagram: "https://instagram.com/sowndystylestudio",
  youtube: "",
  upiId: "sowndy@upi",
  address: "Your shop street, City, Tamil Nadu, PIN",
  billFooter: "Thank you for shopping with SOWNDY STYLE STUDIO. Exchange within 3 days with bill.",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Chennai&t=&z=13&ie=UTF8&iwloc=&output=embed",
} as const;

export const SHOP_CATEGORIES = [
  { slug: "saree", label: "Sarees", href: "/sarees" },
  { slug: "saree-dhoti", label: "Saree Dhoti", href: "/saree-dhoti" },
  {
    slug: "saree-pre-pleating",
    label: "Saree Pre-Pleating",
    href: "/saree-pre-pleating",
  },
  { slug: "jewelry", label: "Jewelry", href: "/jewelry" },
] as const;

export const CATEGORIES = [
  ...SHOP_CATEGORIES,
  { slug: "chudidar", label: "Chudidar", href: "/chudidar" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/sarees", label: "Sarees" },
  { href: "/saree-dhoti", label: "Saree Dhoti" },
  { href: "/saree-pre-pleating", label: "Saree Pre-Pleating" },
  { href: "/jewelry", label: "Jewelry" },
  { href: "/chudidar", label: "Chudidar" },
  { href: "/new-collections", label: "New Collections" },
  { href: "/contact", label: "Contact" },
] as const;
