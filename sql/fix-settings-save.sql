alter table public.settings add column if not exists youtube text not null default '';
alter table public.settings add column if not exists logo_url text not null default '';

insert into public.settings (id) values (1) on conflict (id) do nothing;

alter table public.settings enable row level security;

drop policy if exists public_read_settings on public.settings;
drop policy if exists admin_write_settings on public.settings;

create policy public_read_settings on public.settings
  for select to anon, authenticated using (true);

create policy admin_write_settings on public.settings
  for all to authenticated using (true) with check (true);
