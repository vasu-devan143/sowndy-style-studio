import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AuthProvider } from "@/lib/auth";
import { BRAND } from "@/lib/brand";
import { CartProvider } from "@/lib/cart";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description: `${BRAND.name} — sarees, chudidar and ready-to-wear pre-pleated sarees. Order on WhatsApp.`,
  openGraph: {
    title: BRAND.name,
    description: BRAND.tagline,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <Header />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24">{children}</main>
              <Footer />
              <WhatsAppFloat />
            </CartProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
