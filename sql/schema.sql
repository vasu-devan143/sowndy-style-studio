create table if not exists public.settings (
  id int primary key default 1,
  brand_name text not null default 'SOWNDY STYLE STUDIO',
  phone text not null default '',
  whatsapp text not null default '',
  instagram text not null default '',
  youtube text not null default '',
  upi_id text not null default '',
  upi_qr_url text not null default '',
  logo_url text not null default '',
  address text not null default '',
  bill_footer text not null default '',
  map_embed_url text not null default '',
  constraint one_row check (id = 1)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('saree', 'saree-dhoti', 'chudidar', 'saree-pre-pleating', 'jewelry')),
  price numeric not null default 0,
  description text not null default '',
  fabric text not null default '',
  color text not null default '',
  sizes text not null default 'Free size',
  stock_quantity int not null default 0,
  is_new boolean not null default false,
  coupon_code text not null default '',
  created_at timestamptz not null default now()
);

create unique index if not exists products_coupon_code_unique
  on public.products (lower(coupon_code))
  where coupon_code <> '';

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  customer_name text not null default '',
  customer_phone text not null default '',
  discount numeric not null default 0,
  payment_mode text not null default 'UPI',
  subtotal numeric not null default 0,
  total numeric not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  product_id uuid,
  product_name text not null,
  quantity int not null default 1,
  unit_price numeric not null default 0,
  line_total numeric not null default 0
);

insert into public.settings (id) values (1) on conflict (id) do nothing;

alter table public.settings enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

drop policy if exists public_read_products on public.products;
drop policy if exists public_read_images on public.product_images;
drop policy if exists public_read_settings on public.settings;
drop policy if exists admin_write_products on public.products;
drop policy if exists admin_write_images on public.product_images;
drop policy if exists admin_write_settings on public.settings;
drop policy if exists admin_all_sales on public.sales;
drop policy if exists admin_all_sale_items on public.sale_items;

create policy public_read_products on public.products for select to anon, authenticated using (true);
create policy public_read_images on public.product_images for select to anon, authenticated using (true);
create policy public_read_settings on public.settings for select to anon, authenticated using (true);

create policy admin_write_products on public.products for all to authenticated using (true) with check (true);
create policy admin_write_images on public.product_images for all to authenticated using (true) with check (true);
create policy admin_write_settings on public.settings for all to authenticated using (true) with check (true);
create policy admin_all_sales on public.sales for all to authenticated using (true) with check (true);
create policy admin_all_sale_items on public.sale_items for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists public_read_product_images on storage.objects;
drop policy if exists admin_write_product_images on storage.objects;

create policy public_read_product_images
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy admin_write_product_images
on storage.objects for all
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');
