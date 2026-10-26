"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice, type Product } from "@/lib/shop/catalog";
import { notifyCartChanged, useDefect } from "./use-defect";

export function ProductDetail({ product }: { product: Product }) {
  const [inStock, setInStock] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState<string[] | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const stockHangs = useDefect("stockCheckHangs");
  const reviewsNeverLoad = useDefect("reviewsNeverLoad");
  const priceWrong = useDefect("detailPriceWrong");

  useEffect(() => {
    if (stockHangs) return;
    let active = true;
    fetch(`/api/shop/products/${product.id}`)
      .then((response) => response.json())
      .then((data: { inStock: boolean }) => active && setInStock(data.inStock));
    return () => {
      active = false;
    };
  }, [product.id, stockHangs]);

  const showReviews = async () => {
    setLoadingReviews(true);
    if (reviewsNeverLoad) return;
    const response = await fetch(`/api/shop/products/${product.id}/reviews`);
    const data = (await response.json()) as { reviews: string[] };
    setReviews(data.reviews);
    setLoadingReviews(false);
  };

  const addToCart = async () => {
    await fetch("/api/shop/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity: Number(quantity) || 1 })
    });
    setMessage("Added to cart.");
    notifyCartChanged();
  };

  return (
    <article className="product-detail" aria-labelledby="product-heading">
      <Link href="/shop" className="muted small">← Back to catalog</Link>
      <p className="eyebrow">{product.category}</p>
      <h1 id="product-heading">{product.name}</h1>
      <p className="price large" data-testid="product-price">{formatPrice(product.price + (priceWrong ? 1 : 0))}</p>
      <p>{product.description}</p>
      <p className="muted" data-testid="stock-status">{inStock ? "In stock" : "Checking stock..."}</p>
      <div className="inline-form">
        <label>
          Quantity
          <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(event.target.value)} />
        </label>
        <button className="primary-button" type="button" disabled={!inStock} onClick={addToCart}>Add to cart</button>
      </div>
      <div className="shop-message" role="status">{message}</div>
      <section aria-labelledby="reviews-heading" className="reviews">
        <h2 id="reviews-heading">Reviews</h2>
        {!reviews && !loadingReviews && (
          <button className="secondary-button" type="button" onClick={showReviews}>Show reviews</button>
        )}
        {loadingReviews && <p className="muted">Loading reviews...</p>}
        {reviews && (
          <ul aria-label="Reviews">
            {reviews.map((review) => <li key={review}>{review}</li>)}
          </ul>
        )}
      </section>
    </article>
  );
}
