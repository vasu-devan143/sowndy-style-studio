import { inr, prettyDate } from "@/lib/format";
import type { Sale, ShopSettings } from "@/lib/types";

export function InvoiceView({
  sale,
  settings,
  layout,
}: {
  sale: Sale;
  settings: ShopSettings;
  layout: "a4" | "thermal";
}) {
  const wrap = layout === "a4" ? "bill-a4" : "bill-thermal";
  return (
    <div className={`${wrap} mx-auto border border-black/10`}>
      <div className="text-center">
        {settings.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.logo_url} alt={settings.brand_name} className="mx-auto mb-2 h-14 w-auto object-contain" />
        ) : (
          <p className="logo-type text-2xl font-semibold tracking-[0.2em]">{settings.brand_name}</p>
        )}
        <p className="mt-1 text-sm">{settings.address}</p>
        <p className="text-sm">Ph: {settings.phone}</p>
      </div>
      <hr className="my-3" />
      <div className="flex justify-between text-sm">
        <div>
          <p>Bill No: {sale.invoice_number}</p>
          <p>Date: {prettyDate(sale.created_at)}</p>
        </div>
        <div className="text-right">
          <p>To: {sale.customer_name || "Walk-in"}</p>
          <p>{sale.customer_phone}</p>
        </div>
      </div>
      <table className="mt-3 w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-1">Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item) => (
            <tr key={item.id} className="border-b border-black/10">
              <td className="py-1 pr-2">{item.product_name}</td>
              <td>{item.quantity}</td>
              <td>{inr(item.unit_price)}</td>
              <td className="text-right">{inr(item.line_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 space-y-1 text-sm">
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span>{inr(sale.subtotal)}</span>
        </p>
        <p className="flex justify-between">
          <span>Discount</span>
          <span>{inr(sale.discount)}</span>
        </p>
        <p className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{inr(sale.total)}</span>
        </p>
        <p>Paid by: {sale.payment_mode}</p>
        {sale.notes ? <p className="mt-2 whitespace-pre-wrap text-left">{sale.notes}</p> : null}
      </div>
      <p className="mt-6 text-center text-sm">{settings.bill_footer}</p>
      <p className="mt-2 text-center text-xs">Thank you</p>
    </div>
  );
}
