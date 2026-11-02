alter table public.products add column if not exists original_price numeric not null default 0;
alter table public.products add column if not exists coupon_code text not null default '';

create unique index if not exists products_coupon_code_unique
  on public.products (lower(coupon_code))
  where coupon_code <> '';

alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check
  check (category in ('saree', 'saree-dhoti', 'chudidar', 'saree-pre-pleating', 'jewelry'));

alter table public.products enable row level security;
alter table public.product_images enable row level security;

drop policy if exists public_read_products on public.products;
drop policy if exists public_read_images on public.product_images;
drop policy if exists admin_write_products on public.products;
drop policy if exists admin_write_images on public.product_images;

create policy public_read_products on public.products for select to anon, authenticated using (true);
create policy public_read_images on public.product_images for select to anon, authenticated using (true);
create policy admin_write_products on public.products for all to authenticated using (true) with check (true);
create policy admin_write_images on public.product_images for all to authenticated using (true) with check (true);

notify pgrst, 'reload schema';
