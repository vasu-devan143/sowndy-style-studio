-- Optional sample products. Run after schema.sql.
-- Photos are public Unsplash images so the shop looks full before you upload your own.

insert into public.settings (
  id, brand_name, phone, whatsapp, instagram, upi_id, address, bill_footer, map_embed_url
) values (
  1,
  'SOWNDY STYLE STUDIO',
  '9000000000',
  '919000000000',
  'https://instagram.com/sowndystylestudio',
  'sowndy@upi',
  'Your shop street, City, Tamil Nadu, PIN',
  'Thank you for shopping with SOWNDY STYLE STUDIO. Exchange within 3 days with bill.',
  'https://maps.google.com/maps?q=Chennai&t=&z=13&ie=UTF8&iwloc=&output=embed'
)
on conflict (id) do update set brand_name = excluded.brand_name;

-- Clear sample rows if you re-run this file
delete from public.sale_items;
delete from public.sales;
delete from public.product_images;
delete from public.products;

insert into public.products (id, name, category, price, description, fabric, color, sizes, stock_quantity, is_new, created_at)
values
  ('11111111-1111-1111-1111-111111111111', 'Banarasi Silk Saree — Rose Gold', 'saree', 4890, 'A festive Banarasi silk saree with a soft rose-gold weave and wide zari border.', 'Banarasi silk', 'Rose gold', 'Free size', 8, true, now()),
  ('22222222-2222-2222-2222-222222222222', 'Kanchipuram Bridal Saree — Maroon', 'saree', 12990, 'Heavy Kanchipuram silk in deep maroon with gold temple border.', 'Kanchipuram silk', 'Maroon / Gold', 'Free size', 2, false, now()),
  ('33333333-3333-3333-3333-333333333333', 'Cotton Handloom Saree — Ivory', 'saree', 1890, 'Light daily-wear handloom cotton saree.', 'Handloom cotton', 'Ivory', 'Free size', 12, false, now()),
  ('44444444-4444-4444-4444-444444444444', 'Anarkali Chudidar Set — Mint', 'chudidar', 2490, 'Flowy mint Anarkali with matching chudidar and dupatta.', 'Georgette', 'Mint green', 'S, M, L, XL', 6, true, now()),
  ('55555555-5555-5555-5555-555555555555', 'Soft Silk Chudidar — Peach', 'chudidar', 1690, 'Simple peach silk-blend kurta set.', 'Silk blend', 'Peach', 'M, L', 0, false, now()),
  ('66666666-6666-6666-6666-666666666666', 'Ready Pre-Pleated Saree — Navy', 'saree-pre-pleating', 3290, 'Ready-to-wear pre-pleated saree. Hook the blouse, clip the pallu, and go.', 'Georgette with pre-stitched pleats', 'Navy blue', 'Free size (upto 42 waist)', 5, true, now());

insert into public.product_images (product_id, url, sort_order) values
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80', 0),
  ('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=80', 0),
  ('33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1605763240004-7e1133101672?auto=format&fit=crop&w=1200&q=80', 0),
  ('44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=1200&q=80', 0),
  ('55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=80', 0),
  ('66666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1602424246749-0d5cd0466a5a?auto=format&fit=crop&w=1200&q=80', 0);
