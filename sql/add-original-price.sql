alter table public.products add column if not exists original_price numeric not null default 0;
