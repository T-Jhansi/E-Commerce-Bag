"use client";

import Link from "next/link";
import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { formatINR } from "@/lib/format";
import { deleteProduct } from "@/lib/product-store";

export default function AdminProductsPage() {
  const { products, ready } = useProducts();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (confirmingId !== id) {
      setConfirmingId(id);
      return;
    }
    deleteProduct(id);
    setConfirmingId(null);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{products.length} in catalogue</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-leather px-4 py-2 text-sm font-medium text-white transition hover:bg-leather-dark"
        >
          Add product
        </Link>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {ready && products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted)]">
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="font-medium text-leather hover:underline"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-[var(--muted)]">{p.colorway}</p>
                </td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3 tabular-nums">{formatINR(p.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.stock === 0
                        ? "font-medium text-rose-600"
                        : p.stock <= 5
                          ? "font-medium text-amber-600"
                          : ""
                    }
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">{p.featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    onBlur={() => setConfirmingId(null)}
                    className={`text-sm font-medium ${
                      confirmingId === p.id ? "text-rose-600" : "text-[var(--muted)] hover:text-rose-600"
                    }`}
                  >
                    {confirmingId === p.id ? "Confirm delete" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
