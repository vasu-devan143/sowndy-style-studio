import type { PaymentMode } from "./types";

export type CheckoutPayMethod = "upi" | "gpay" | "phonepe";
export type DwellingType = "home" | "apartment";

export type DeliveryDetails = {
  country: string;
  name: string;
  address: string;
  dwelling: DwellingType;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

export const emptyDelivery: DeliveryDetails = {
  country: "India",
  name: "",
  address: "",
  dwelling: "home",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

const STORAGE_KEY = "sowndy-checkout-delivery";

export function loadDelivery(): DeliveryDetails {
  if (typeof window === "undefined") return emptyDelivery;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDelivery;
    const parsed = JSON.parse(raw) as Partial<DeliveryDetails>;
    return {
      country: String(parsed.country ?? "India"),
      name: String(parsed.name ?? ""),
      address: String(parsed.address ?? ""),
      dwelling: parsed.dwelling === "apartment" ? "apartment" : "home",
      city: String(parsed.city ?? ""),
      state: String(parsed.state ?? ""),
      pincode: String(parsed.pincode ?? ""),
      phone: String(parsed.phone ?? ""),
    };
  } catch {
    return emptyDelivery;
  }
}

export function saveDelivery(details: DeliveryDetails) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
}

export function payMethodToMode(method: CheckoutPayMethod): PaymentMode {
  if (method === "gpay") return "GPay";
  if (method === "phonepe") return "PhonePe";
  return "UPI";
}

export function payMethodLabel(method: CheckoutPayMethod) {
  if (method === "gpay") return "GPay";
  if (method === "phonepe") return "PhonePe";
  return "UPI transaction";
}

export function validateDelivery(details: DeliveryDetails) {
  if (!details.country.trim()) return "Please enter your country.";
  if (!details.name.trim()) return "Please enter your name.";
  if (!details.address.trim()) return "Please enter your full address.";
  if (!details.city.trim()) return "Please enter your city.";
  if (!details.state.trim()) return "Please enter your state.";
  if (!/^\d{6}$/.test(details.pincode.trim())) return "Please enter a 6-digit PIN code.";
  if (details.phone.replace(/\D/g, "").length < 10) return "Please enter a 10-digit phone number.";
  return "";
}

export function formatDeliveryNotes(details: DeliveryDetails, method: CheckoutPayMethod) {
  const place = details.dwelling === "apartment" ? "Apartment" : "Home";
  return [
    "Website checkout",
    `Pay by: ${payMethodLabel(method)}`,
    `Name: ${details.name.trim()}`,
    `Phone: ${details.phone.trim()}`,
    `Place: ${place}`,
    `Address: ${details.address.trim()}`,
    `City: ${details.city.trim()}`,
    `State: ${details.state.trim()}`,
    `PIN: ${details.pincode.trim()}`,
    `Country: ${details.country.trim()}`,
  ].join("\n");
}
