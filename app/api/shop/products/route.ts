import { PAGE_SIZE, products } from "@/lib/shop/catalog";
import { defectActive } from "@/lib/shop/server";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "name";
  const page = Math.max(1, Number(params.get("page") ?? 1) || 1);

  let items = products.filter(
    (product) =>
      (!query || defectActive("searchIgnored", request) || product.name.toLowerCase().includes(query)) &&
      (!category || product.category === category)
  );
  if (defectActive("apiDropsKettlebell", request)) {
    items = items.filter((product) => product.id !== "steel-kettlebell");
  }
  if (query && defectActive("searchDropsLastResult", request)) items = items.slice(0, -1);
  items = [...items].sort((a, b) =>
    sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : a.name.localeCompare(b.name)
  );

  // A small delay makes the loading state observable.
  await new Promise((resolve) => setTimeout(resolve, 300));
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  return Response.json({
    items: items
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
      .map(({ id, name, price, category, sale }) => ({ id, name, price, category, sale })),
    total: items.length,
    page,
    pages
  });
}
