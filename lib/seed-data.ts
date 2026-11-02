import { BRAND } from "./brand";
import type { Product, Sale, ShopSettings } from "./types";

export const defaultSettings: ShopSettings = {
  brand_name: BRAND.name,
  phone: BRAND.phone,
  whatsapp: BRAND.whatsapp,
  instagram: BRAND.instagram,
  youtube: BRAND.youtube,
  upi_id: BRAND.upiId,
  upi_qr_url: "",
  logo_url: "",
  address: BRAND.address,
  bill_footer: BRAND.billFooter,
  map_embed_url: BRAND.mapEmbedUrl,
};

const now = "2026-10-20T10:00:00.000Z";

/** Sample catalog so the shop looks complete on first run. */
export const seedProducts: Product[] = [
  {
    id: "p1",
    name: "Banarasi Silk Saree — Rose Gold",
    category: "saree",
    price: 4890,
    description:
      "A festive Banarasi silk saree with a soft rose-gold weave and wide zari border. Ready for wedding functions and temple visits.",
    fabric: "Banarasi silk",
    color: "Rose gold",
    sizes: "Free size",
    stock_quantity: 8,
    is_new: true,
    created_at: now,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p2",
    name: "Kanchipuram Bridal Saree — Maroon",
    category: "saree",
    price: 12990,
    description:
      "Heavy Kanchipuram silk in deep maroon with gold temple border. Best for bridal and reception wear.",
    fabric: "Kanchipuram silk",
    color: "Maroon / Gold",
    sizes: "Free size",
    stock_quantity: 2,
    is_new: false,
    created_at: "2026-10-12T10:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p3",
    name: "Cotton Handloom Saree — Ivory",
    category: "saree",
    price: 1890,
    description:
      "Light daily-wear handloom cotton saree. Soft on the skin and easy to drape for office or casual outings.",
    fabric: "Handloom cotton",
    color: "Ivory",
    sizes: "Free size",
    stock_quantity: 12,
    is_new: false,
    created_at: "2026-09-28T10:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1605763240004-7e1133101672?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p4",
    name: "Anarkali Chudidar Set — Mint",
    category: "chudidar",
    price: 2490,
    description:
      "Flowy mint Anarkali with matching chudidar and dupatta. Comfortable georgette, nice for family functions.",
    fabric: "Georgette",
    color: "Mint green",
    sizes: "S, M, L, XL",
    stock_quantity: 6,
    is_new: true,
    created_at: "2026-10-18T10:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p5",
    name: "Soft Silk Chudidar — Peach",
    category: "chudidar",
    price: 1690,
    description:
      "Simple peach silk-blend kurta set. Sold out in this colour — customers can still see it and message you.",
    fabric: "Silk blend",
    color: "Peach",
    sizes: "M, L",
    stock_quantity: 0,
    is_new: false,
    created_at: "2026-09-10T10:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p6",
    name: "Ready Pre-Pleated Saree — Navy",
    category: "saree-pre-pleating",
    price: 3290,
    description:
      "Ready-to-wear pre-pleated saree. Hook the blouse, clip the pallu, and go. Perfect if you do not want to drape from scratch.",
    fabric: "Georgette with pre-stitched pleats",
    color: "Navy blue",
    sizes: "Free size (upto 42 waist)",
    stock_quantity: 5,
    is_new: true,
    created_at: "2026-10-22T10:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1602424246749-0d5cd0466a5a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596484557996-48e4c0d3d0d3?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

export const seedSales: Sale[] = [
  {
    id: "s1",
    invoice_number: "SSS-2026-0001",
    customer_name: "Meena R",
    customer_phone: "9876543210",
    discount: 200,
    payment_mode: "UPI",
    subtotal: 4890,
    total: 4690,
    notes: "Instagram order",
    created_at: new Date().toISOString(),
    items: [
      {
        id: "si1",
        sale_id: "s1",
        product_id: "p1",
        product_name: "Banarasi Silk Saree — Rose Gold",
        quantity: 1,
        unit_price: 4890,
        line_total: 4890,
      },
    ],
  },
];
