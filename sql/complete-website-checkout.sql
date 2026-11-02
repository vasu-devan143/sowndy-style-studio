create or replace function public.complete_website_checkout(
  p_customer_name text,
  p_customer_phone text,
  p_payment_mode text,
  p_notes text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sale_id uuid;
  v_invoice text;
  v_subtotal numeric := 0;
  v_year int := extract(year from now())::int;
  v_max int;
  v_item jsonb;
  v_qty int;
  v_pid uuid;
  v_product public.products%rowtype;
  v_items jsonb := '[]'::jsonb;
begin
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) < 1 then
    raise exception 'Bag is empty';
  end if;

  select coalesce(max(nullif(substring(invoice_number from 'SSS-[0-9]{4}-([0-9]+)'), '')::int), 0)
    into v_max
  from public.sales
  where invoice_number like 'SSS-' || v_year || '-%';

  v_invoice := 'SSS-' || v_year || '-' || lpad((v_max + 1)::text, 4, '0');

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_pid := (v_item->>'product_id')::uuid;
    v_qty := greatest(1, coalesce((v_item->>'quantity')::int, 0));

    update public.products
      set stock_quantity = stock_quantity - v_qty
      where id = v_pid
        and stock_quantity >= v_qty
      returning * into v_product;

    if not found then
      raise exception 'Sold out';
    end if;

    v_subtotal := v_subtotal + (v_product.price * v_qty);
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'product_name', v_product.name,
      'quantity', v_qty,
      'unit_price', v_product.price,
      'line_total', v_product.price * v_qty
    ));
  end loop;

  insert into public.sales (
    invoice_number, customer_name, customer_phone, discount, payment_mode, subtotal, total, notes
  ) values (
    v_invoice,
    coalesce(nullif(trim(p_customer_name), ''), 'Website order'),
    coalesce(p_customer_phone, ''),
    0,
    coalesce(nullif(p_payment_mode, ''), 'UPI'),
    v_subtotal,
    v_subtotal,
    coalesce(p_notes, '')
  )
  returning id into v_sale_id;

  insert into public.sale_items (sale_id, product_id, product_name, quantity, unit_price, line_total)
  select
    v_sale_id,
    (item->>'product_id')::uuid,
    item->>'product_name',
    (item->>'quantity')::int,
    (item->>'unit_price')::numeric,
    (item->>'line_total')::numeric
  from jsonb_array_elements(v_items) as item;

  return jsonb_build_object(
    'id', v_sale_id,
    'invoice_number', v_invoice,
    'customer_name', coalesce(nullif(trim(p_customer_name), ''), 'Website order'),
    'customer_phone', coalesce(p_customer_phone, ''),
    'discount', 0,
    'payment_mode', coalesce(nullif(p_payment_mode, ''), 'UPI'),
    'subtotal', v_subtotal,
    'total', v_subtotal,
    'notes', coalesce(p_notes, ''),
    'created_at', now(),
    'items', v_items
  );
end;
$$;

revoke all on function public.complete_website_checkout(text, text, text, text, jsonb) from public;
grant execute on function public.complete_website_checkout(text, text, text, text, jsonb) to anon, authenticated;
