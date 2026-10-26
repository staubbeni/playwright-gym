import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/product-detail";
import { ShopFrame } from "@/components/shop/shop-frame";
import { findProduct } from "@/lib/shop/catalog";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = findProduct(params.id);
  if (!product) notFound();
  return (
    <ShopFrame>
      <ProductDetail product={product} />
    </ShopFrame>
  );
}
