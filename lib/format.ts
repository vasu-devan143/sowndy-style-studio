export function inr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function normalizeCoupon(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function waLink(whatsapp: string, message: string) {
  const phone = digitsOnly(whatsapp);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function upiPayParams(upiId: string, payeeName: string, amount: number, note: string) {
  return new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: String(amount),
    cu: "INR",
    tn: note.slice(0, 50),
  });
}

export function upiLink(upiId: string, payeeName: string, amount: number, note: string) {
  return `upi://pay?${upiPayParams(upiId, payeeName, amount, note).toString()}`;
}

export function gpayLink(upiId: string, payeeName: string, amount: number, note: string) {
  const q = upiPayParams(upiId, payeeName, amount, note).toString();
  return `tez://upi/pay?${q}`;
}

export function phonepeLink(upiId: string, payeeName: string, amount: number, note: string) {
  const q = upiPayParams(upiId, payeeName, amount, note).toString();
  return `phonepe://pay?${q}`;
}

export function prettyDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function dateOnly(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function nextInvoiceNumber(existing: string[]) {
  const year = new Date().getFullYear();
  const prefix = `SSS-${year}-`;
  let max = 0;
  for (const n of existing) {
    if (n.startsWith(prefix)) {
      const num = Number(n.slice(prefix.length));
      if (!Number.isNaN(num)) max = Math.max(max, num);
    }
  }
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function inRange(iso: string, from: Date, to: Date) {
  const t = new Date(iso).getTime();
  return t >= from.getTime() && t <= to.getTime();
}

export function downloadText(filename: string, text: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
