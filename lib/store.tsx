"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { blobToDataUrl, compressImage } from "./image-compress";
import { defaultSettings, seedProducts, seedSales } from "./seed-data";
import { getSupabase, isSupabaseConfigured } from "./supabase/client";
import type { PaymentMode, Product, Sale, SaleItem, ShopSettings } from "./types";
import { nextInvoiceNumber } from "./format";

const LS_KEY = "sowndy-shop-store-v1";

type DemoBundle = {
  products: Product[];
  sales: Sale[];
  settings: ShopSettings;
};

type ProductInput = Omit<Product, "id" | "created_at" | "images"> & {
  images?: string[];
};

type StoreContextValue = {
  ready: boolean;
  usingDemo: boolean;
  products: Product[];
  sales: Sale[];
  settings: ShopSettings;
  error: string | null;
  refresh: () => Promise<void>;
  saveProduct: (input: ProductInput, id?: string) => Promise<Product>;
  uploadPhotos: (files: File[]) => Promise<string[]>;
  deleteProduct: (id: string) => Promise<void>;
  setStock: (id: string, qty: number) => Promise<void>;
  recordSale: (input: {
    customer_name: string;
    customer_phone: string;
    discount: number;
    payment_mode: PaymentMode;
    notes: string;
    items: { product_id: string; quantity: number }[];
  }) => Promise<Sale>;
  saveSettings: (next: ShopSettings) => Promise<void>;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function loadDemo(): DemoBundle {
  if (typeof window === "undefined") {
    return { products: seedProducts, sales: seedSales, settings: defaultSettings };
  }
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoBundle;
      if (parsed.products?.length) return parsed;
    }
  } catch {
    /* ignore */
  }
  const initial = { products: seedProducts, sales: seedSales, settings: defaultSettings };
  localStorage.setItem(LS_KEY, JSON.stringify(initial));
  return initial;
}

function persistDemo(bundle: DemoBundle) {
  localStorage.setItem(LS_KEY, JSON.stringify(bundle));
}

function mapProduct(
  row: Record<string, unknown>,
  images: { product_id: string; url: string; sort_order: number }[],
): Product {
  return {
    id: String(row.id),
    name: String(row.name),
    category: row.category as Product["category"],
    price: Number(row.price),
    description: String(row.description ?? ""),
    fabric: String(row.fabric ?? ""),
    color: String(row.color ?? ""),
    sizes: String(row.sizes ?? ""),
    stock_quantity: Number(row.stock_quantity ?? 0),
    is_new: Boolean(row.is_new),
    created_at: String(row.created_at),
    images: images
      .filter((img) => img.product_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => img.url),
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const usingDemo = !isSupabaseConfigured();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [sales, setSales] = useState<Sale[]>(seedSales);
  const [settings, setSettings] = useState<ShopSettings>(defaultSettings);

  const refresh = useCallback(async () => {
    setError(null);
    if (usingDemo) {
      const demo = loadDemo();
      setProducts(demo.products);
      setSales(demo.sales);
      setSettings(demo.settings);
      setReady(true);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) return;

    const [prodRes, imgRes, saleRes, itemRes, setRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("product_images").select("*").order("sort_order"),
      supabase.from("sales").select("*").order("created_at", { ascending: false }),
      supabase.from("sale_items").select("*"),
      supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
    ]);

    if (prodRes.error) throw prodRes.error;
    if (imgRes.error) throw imgRes.error;
    if (saleRes.error) throw saleRes.error;
    if (itemRes.error) throw itemRes.error;

    const imgs = (imgRes.data ?? []) as { product_id: string; url: string; sort_order: number }[];
    const mappedProducts = ((prodRes.data ?? []) as Record<string, unknown>[]).map((row) =>
      mapProduct(row, imgs),
    );
    const items = (itemRes.data ?? []) as SaleItem[];
    const mappedSales: Sale[] = ((saleRes.data ?? []) as Record<string, unknown>[]).map((row) => ({
      id: String(row.id),
      invoice_number: String(row.invoice_number),
      customer_name: String(row.customer_name),
      customer_phone: String(row.customer_phone),
      discount: Number(row.discount),
      payment_mode: row.payment_mode as PaymentMode,
      subtotal: Number(row.subtotal),
      total: Number(row.total),
      notes: String(row.notes ?? ""),
      created_at: String(row.created_at),
      items: items.filter((it) => it.sale_id === row.id),
    }));

    setProducts(mappedProducts);
    setSales(mappedSales);
    if (setRes.data) {
      setSettings({
        brand_name: setRes.data.brand_name,
        phone: setRes.data.phone,
        whatsapp: setRes.data.whatsapp,
        instagram: setRes.data.instagram,
        upi_id: setRes.data.upi_id,
        upi_qr_url: setRes.data.upi_qr_url ?? "",
        logo_url: setRes.data.logo_url ?? "",
        address: setRes.data.address,
        bill_footer: setRes.data.bill_footer,
        map_embed_url: setRes.data.map_embed_url ?? "",
      });
    }
    setReady(true);
  }, [usingDemo]);

  useEffect(() => {
    refresh().catch((err: Error) => {
      setError(err.message);
      setReady(true);
    });
  }, [refresh]);

  const uploadPhotos = useCallback(async (files: File[]) => {
    const urls: string[] = [];
    const supabase = getSupabase();
    for (const file of files) {
      const compressed = await compressImage(file);
      if (usingDemo || !supabase) {
        urls.push(await blobToDataUrl(compressed));
        continue;
      }
      const path = `${crypto.randomUUID()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, compressed, { contentType: "image/jpeg", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  }, [usingDemo]);

  const saveProduct = useCallback(
    async (input: ProductInput, id?: string) => {
      if (usingDemo) {
        const demo = loadDemo();
        if (id) {
          demo.products = demo.products.map((p) =>
            p.id === id ? { ...p, ...input, images: input.images ?? p.images } : p,
          );
        } else {
          demo.products = [
            {
              ...input,
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
              images: input.images ?? [],
            },
            ...demo.products,
          ];
        }
        persistDemo(demo);
        await refresh();
        return demo.products.find((p) => p.name === input.name)!;
      }

      const supabase = getSupabase()!;
      const payload = {
        name: input.name,
        category: input.category,
        price: input.price,
        description: input.description,
        fabric: input.fabric,
        color: input.color,
        sizes: input.sizes,
        stock_quantity: input.stock_quantity,
        is_new: input.is_new,
      };

      let productId = id;
      if (id) {
        const { error: err } = await supabase.from("products").update(payload).eq("id", id);
        if (err) throw err;
        if (input.images) {
          await supabase.from("product_images").delete().eq("product_id", id);
        }
      } else {
        const { data, error: err } = await supabase.from("products").insert(payload).select("id").single();
        if (err) throw err;
        productId = data.id as string;
      }

      if (input.images && productId) {
        const rows = input.images.map((url, sort_order) => ({
          product_id: productId,
          url,
          sort_order,
        }));
        if (rows.length) {
          const { error: imgErr } = await supabase.from("product_images").insert(rows);
          if (imgErr) throw imgErr;
        }
      }

      await refresh();
      return (await Promise.resolve(
        loadAfterSave(productId!),
      )) as Product;

      function loadAfterSave(pid: string) {
        return {
          id: pid,
          ...input,
          created_at: new Date().toISOString(),
          images: input.images ?? [],
        };
      }
    },
    [refresh, usingDemo],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (usingDemo) {
        const demo = loadDemo();
        demo.products = demo.products.filter((p) => p.id !== id);
        persistDemo(demo);
        await refresh();
        return;
      }
      const { error: err } = await getSupabase()!.from("products").delete().eq("id", id);
      if (err) throw err;
      await refresh();
    },
    [refresh, usingDemo],
  );

  const setStock = useCallback(
    async (id: string, qty: number) => {
      const nextQty = Math.max(0, qty);
      if (usingDemo) {
        const demo = loadDemo();
        demo.products = demo.products.map((p) =>
          p.id === id ? { ...p, stock_quantity: nextQty } : p,
        );
        persistDemo(demo);
        await refresh();
        return;
      }
      const { error: err } = await getSupabase()!
        .from("products")
        .update({ stock_quantity: nextQty })
        .eq("id", id);
      if (err) throw err;
      await refresh();
    },
    [refresh, usingDemo],
  );

  const recordSale = useCallback(
    async (input: {
      customer_name: string;
      customer_phone: string;
      discount: number;
      payment_mode: PaymentMode;
      notes: string;
      items: { product_id: string; quantity: number }[];
    }) => {
      const lines = input.items
        .map((line) => {
          const product = products.find((p) => p.id === line.product_id);
          if (!product) throw new Error("A product in this bill was not found");
          if (product.stock_quantity < line.quantity) {
            throw new Error(`${product.name} has only ${product.stock_quantity} left`);
          }
          return {
            product,
            quantity: line.quantity,
            unit_price: product.price,
            line_total: product.price * line.quantity,
          };
        });
      const subtotal = lines.reduce((sum, l) => sum + l.line_total, 0);
      const total = Math.max(0, subtotal - (input.discount || 0));
      const invoice = nextInvoiceNumber(sales.map((s) => s.invoice_number));

      if (usingDemo) {
        const demo = loadDemo();
        const sale: Sale = {
          id: crypto.randomUUID(),
          invoice_number: invoice,
          customer_name: input.customer_name,
          customer_phone: input.customer_phone,
          discount: input.discount || 0,
          payment_mode: input.payment_mode,
          subtotal,
          total,
          notes: input.notes,
          created_at: new Date().toISOString(),
          items: lines.map((l) => ({
            id: crypto.randomUUID(),
            sale_id: "",
            product_id: l.product.id,
            product_name: l.product.name,
            quantity: l.quantity,
            unit_price: l.unit_price,
            line_total: l.line_total,
          })),
        };
        sale.items = sale.items.map((it) => ({ ...it, sale_id: sale.id }));
        demo.sales = [sale, ...demo.sales];
        demo.products = demo.products.map((p) => {
          const used = lines.find((l) => l.product.id === p.id);
          if (!used) return p;
          return { ...p, stock_quantity: p.stock_quantity - used.quantity };
        });
        persistDemo(demo);
        await refresh();
        return sale;
      }

      const supabase = getSupabase()!;
      const { data: saleRow, error: saleErr } = await supabase
        .from("sales")
        .insert({
          invoice_number: invoice,
          customer_name: input.customer_name,
          customer_phone: input.customer_phone,
          discount: input.discount || 0,
          payment_mode: input.payment_mode,
          subtotal,
          total,
          notes: input.notes,
        })
        .select("*")
        .single();
      if (saleErr) throw saleErr;

      const itemRows = lines.map((l) => ({
        sale_id: saleRow.id,
        product_id: l.product.id,
        product_name: l.product.name,
        quantity: l.quantity,
        unit_price: l.unit_price,
        line_total: l.line_total,
      }));
      const { error: itemErr } = await supabase.from("sale_items").insert(itemRows);
      if (itemErr) throw itemErr;

      for (const line of lines) {
        const { error: stockErr } = await supabase
          .from("products")
          .update({ stock_quantity: line.product.stock_quantity - line.quantity })
          .eq("id", line.product.id);
        if (stockErr) throw stockErr;
      }

      await refresh();
      return {
        id: saleRow.id,
        invoice_number: saleRow.invoice_number,
        customer_name: saleRow.customer_name,
        customer_phone: saleRow.customer_phone,
        discount: Number(saleRow.discount),
        payment_mode: saleRow.payment_mode,
        subtotal: Number(saleRow.subtotal),
        total: Number(saleRow.total),
        notes: saleRow.notes ?? "",
        created_at: saleRow.created_at,
        items: itemRows.map((it, i) => ({ ...it, id: String(i), sale_id: saleRow.id })),
      };
    },
    [products, refresh, sales, usingDemo],
  );

  const saveSettings = useCallback(
    async (next: ShopSettings) => {
      if (usingDemo) {
        const demo = loadDemo();
        demo.settings = next;
        persistDemo(demo);
        await refresh();
        return;
      }
      const { error: err } = await getSupabase()!.from("settings").update(next).eq("id", 1);
      if (err) throw err;
      await refresh();
    },
    [refresh, usingDemo],
  );

  const value = useMemo(
    () => ({
      ready,
      usingDemo,
      products,
      sales,
      settings,
      error,
      refresh,
      saveProduct,
      uploadPhotos,
      deleteProduct,
      setStock,
      recordSale,
      saveSettings,
    }),
    [
      ready,
      usingDemo,
      products,
      sales,
      settings,
      error,
      refresh,
      saveProduct,
      uploadPhotos,
      deleteProduct,
      setStock,
      recordSale,
      saveSettings,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
