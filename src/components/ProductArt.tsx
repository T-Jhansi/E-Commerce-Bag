import { ProductCategory } from "@/lib/types";

const GRADIENTS: Record<ProductCategory, [string, string]> = {
  Backpacks: ["#8a4b32", "#3f2416"],
  Travel: ["#2f6f6a", "#13302d"],
  "Laptop Bags": ["#52525b", "#18181b"],
  Totes: ["#b15c3b", "#5c2a18"],
  Accessories: ["#6b7a3f", "#2c3318"],
};

export function ProductArt({
  category,
  className,
}: {
  category: ProductCategory;
  className?: string;
}) {
  const [from, to] = GRADIENTS[category];
  const gradId = `grad-${category.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={`${category} illustration`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gradId})`} />
      <g opacity="0.9" stroke="#f3ece2" strokeWidth="3" fill="none" strokeLinejoin="round">
        <path d="M70 80 V62 a30 30 0 0 1 60 0 V80" />
        <rect x="52" y="80" width="96" height="78" rx="10" />
        <line x1="52" y1="104" x2="148" y2="104" />
      </g>
    </svg>
  );
}
