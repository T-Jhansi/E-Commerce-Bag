"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductForm } from "@/components/ProductForm";
import { getProductById, updateProduct } from "@/lib/product-store";
import { NewProductInput, Product } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    setProduct(getProductById(params.id) ?? null);
  }, [params.id]);

  function handleSubmit(input: NewProductInput) {
    updateProduct(params.id, input);
    router.push("/admin/products");
  }

  if (product === undefined) return null;

  if (product === null) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/admin/products" className="text-sm text-[var(--muted)] hover:text-leather">
          ← Back to products
        </Link>
        <p className="mt-6 text-[var(--muted)]">Product not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin/products" className="text-sm text-[var(--muted)] hover:text-leather">
        ← Back to products
      </Link>
      <h1 className="mb-6 mt-4 font-display text-3xl font-semibold">Edit product</h1>
      <ProductForm initial={product} submitLabel="Save changes" onSubmit={handleSubmit} />
    </main>
  );
}
