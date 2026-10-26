import { findProduct } from "@/lib/shop/catalog";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const product = findProduct(params.id);
  if (!product) return Response.json({ error: "Product not found." }, { status: 404 });
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return Response.json({ reviews: product.reviews });
}
