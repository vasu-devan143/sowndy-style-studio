import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="grid gap-3">
      <h2 className="text-2xl">Add product</h2>
      <ProductForm />
    </div>
  );
}
