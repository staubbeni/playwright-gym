import { findProduct } from "@/lib/shop/catalog";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const product = findProduct(params.id);
  if (!product) return Response.json({ error: "Product not found." }, { status: 404 });
  // Simulates a stock check against a slow warehouse service.
  await new Promise((resolve) => setTimeout(resolve, 800));
  return Response.json({ ...product, inStock: true });
}
