alter table public.products add column if not exists coupon_code text not null default '';
create unique index if not exists products_coupon_code_unique
  on public.products (lower(coupon_code))
  where coupon_code <> '';
