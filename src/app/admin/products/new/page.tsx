"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";
import { createProduct } from "@/lib/product-store";
import { NewProductInput } from "@/lib/types";

export default function NewProductPage() {
  const router = useRouter();

  function handleSubmit(input: NewProductInput) {
    createProduct(input);
    router.push("/admin/products");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin/products" className="text-sm text-[var(--muted)] hover:text-leather">
        ← Back to products
      </Link>
      <h1 className="mb-6 mt-4 font-display text-3xl font-semibold">Add product</h1>
      <ProductForm submitLabel="Add product" onSubmit={handleSubmit} />
    </main>
  );
}
