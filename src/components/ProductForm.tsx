"use client";

import { useState } from "react";
import { NewProductInput, PRODUCT_CATEGORIES, Product, ProductCategory } from "@/lib/types";

export function ProductForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Product;
  submitLabel: string;
  onSubmit: (input: NewProductInput) => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    category: initial?.category ?? PRODUCT_CATEGORIES[0],
    price: initial?.price?.toString() ?? "",
    compareAtPrice: initial?.compareAtPrice?.toString() ?? "",
    description: initial?.description ?? "",
    colorway: initial?.colorway ?? "",
    stock: initial?.stock?.toString() ?? "",
    featured: initial?.featured ?? false,
  });
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.name.trim() || !form.description.trim() || !form.colorway.trim()) {
      setError("Please fill in the name, description, and colorway.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid price.");
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError("Enter a valid stock count (0 or more).");
      return;
    }
    onSubmit({
      name: form.name.trim(),
      category: form.category as ProductCategory,
      price,
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      description: form.description.trim(),
      colorway: form.colorway.trim(),
      stock,
      featured: form.featured,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
    >
      <Field label="Name" required>
        <input
          className="input"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Voyager Laptop Backpack"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <select
            className="input"
            value={form.category}
            onChange={(e) => update("category", e.target.value as ProductCategory)}
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Colorway" required>
          <input
            className="input"
            value={form.colorway}
            onChange={(e) => update("colorway", e.target.value)}
            placeholder="Charcoal"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (₹)" required>
          <input
            type="number"
            min="0"
            className="input"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="3499"
          />
        </Field>
        <Field label="Compare-at price (₹, optional)">
          <input
            type="number"
            min="0"
            className="input"
            value={form.compareAtPrice}
            onChange={(e) => update("compareAtPrice", e.target.value)}
            placeholder="3999"
          />
        </Field>
        <Field label="Stock" required>
          <input
            type="number"
            min="0"
            className="input"
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
            placeholder="24"
          />
        </Field>
      </div>

      <Field label="Description" required>
        <textarea
          className="input min-h-28"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="What makes this bag worth buying"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => update("featured", e.target.checked)}
        />
        Feature on the home page
      </label>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        className="rounded-lg bg-leather px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-leather"> *</span>}
      </span>
      {children}
    </label>
  );
}
