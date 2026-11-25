import Image from "next/image";
import { Product } from "@/lib/types";
import { ProductArt } from "@/components/ProductArt";

export function ProductImage({
  product,
  className,
  sizes,
  priority,
}: {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!product.image) {
    return <ProductArt category={product.category} className={className} />;
  }
  return (
    <Image
      src={product.image}
      alt={product.name}
      fill
      sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
      priority={priority}
      className={`object-cover ${className ?? ""}`}
    />
  );
}
