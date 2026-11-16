"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice, products as localProducts } from "@/lib/shop/catalog";
import { notifyCartChanged, useDefect } from "./use-defect";

type Item = { id: string; name: string; price: number; category: string; sale: boolean };
type Result = { items: Item[]; total: number; page: number; pages: number };

export function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const neverLoads = useDefect("catalogNeverLoads");
  const ignoresResponse = useDefect("ignoresApiResponse");
  const errorAsEmpty = useDefect("errorShownAsEmpty");
  const abortAsEmpty = useDefect("abortShownAsEmpty");
  const noEmptyMessage = useDefect("emptyMessageMissing");
  const queryDropped = useDefect("queryNotSent");
  const freeAsZero = useDefect("freeShownAsZero");
  const saleBadgeMissing = useDefect("saleBadgeMissing");
  const addsWrongProduct = useDefect("addsWrongProduct");
  const productLinkWrong = useDefect("productLinkWrong");

  useEffect(() => {
    if (neverLoads) return;
    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams({ q: queryDropped ? "" : query, category, sort, page: String(page) });
    fetch(`/api/shop/products?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        const data = (await response.json()) as Result;
        if (ignoresResponse) {
          const items = localProducts.slice(0, 8);
          setResult({ items, total: items.length, page: 1, pages: 1 });
        } else {
          setResult({ items: data.items ?? [], total: data.total ?? 0, page: data.page ?? 1, pages: data.pages ?? 1 });
        }
        setError(false);
        setLoading(false);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        // An HTTP error reaches us as Error("500"); a network failure as a TypeError.
        const httpError = reason instanceof Error && /^\d+$/.test(reason.message);
        if (httpError ? errorAsEmpty : abortAsEmpty) {
          setResult({ items: [], total: 0, page: 1, pages: 1 });
          setError(false);
        } else {
          setError(true);
        }
        setLoading(false);
        console.warn("Catalog request failed", reason);
      });
    return () => controller.abort();
  }, [query, category, sort, page, neverLoads, ignoresResponse, errorAsEmpty, abortAsEmpty, queryDropped]);

  const addToCart = async (item: Item) => {
    const target = addsWrongProduct && result ? result.items[0] : item;
    await fetch("/api/shop/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: target.id })
    });
    setMessage(`${target.name} added to cart.`);
    notifyCartChanged();
  };

  return (
    <section aria-labelledby="catalog-heading">
      <div className="shop-title-row">
        <h1 id="catalog-heading">Catalog</h1>
        <p className="muted">{result ? `${result.total} products` : ""}</p>
      </div>
      <div className="catalog-controls">
        <label>
          Search products
          <input
            type="search"
            value={query}
            placeholder="Search by name"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Category
          <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>
            <option value="">All</option>
            <option>Apparel</option>
            <option>Equipment</option>
            <option>Nutrition</option>
          </select>
        </label>
        <label>
          Sort by
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="name">Name</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>
      <div className="shop-message" role="status" data-testid="cart-message">{message}</div>
      {loading && <p className="muted">Loading products...</p>}
      {error && (
        <p className="error-text" role="alert">Could not load products. Please try again.</p>
      )}
      {result && !error && result.items.length === 0 && !loading && !noEmptyMessage && <p>No products found.</p>}
      {result && !error && (
        <div className="product-grid">
          {result.items.map((item) => {
            const href = productLinkWrong && item.id === "trail-runner-shoes" ? "/shop/products/performance-tee" : `/shop/products/${item.id}`;
            return (
              <article className="product-card" aria-labelledby={`product-${item.id}`} key={item.id}>
                <div className="product-card-top">
                  <span className="muted small">{item.category}</span>
                  {item.sale && !(saleBadgeMissing && item.id === "resistance-bands") && <span className="sale-badge">Sale</span>}
                </div>
                <h2 id={`product-${item.id}`}><Link href={href}>{item.name}</Link></h2>
                <p className="price">{item.price === 0 && !freeAsZero ? "Free" : formatPrice(item.price)}</p>
                <button className="primary-button" type="button" onClick={() => addToCart(item)}>Add to cart</button>
              </article>
            );
          })}
        </div>
      )}
      {result && result.pages > 1 && (
        <div className="pagination">
          <button type="button" className="secondary-button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous page</button>
          <span>Page {result.page} of {result.pages}</span>
          <button type="button" className="secondary-button" disabled={page >= result.pages} onClick={() => setPage(page + 1)}>Next page</button>
        </div>
      )}
    </section>
  );
}
