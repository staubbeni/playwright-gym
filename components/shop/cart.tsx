"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/shop/catalog";
import { notifyCartChanged, useDefect } from "./use-defect";

type Line = { productId: string; name: string; price: number; quantity: number; lineTotal: number };
export type CartSummary = {
  lines: Line[];
  count: number;
  subtotal: number;
  discountCode: string | null;
  discount: number;
  total: number;
};

export function Cart() {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeMessage, setCodeMessage] = useState("");
  const totalStale = useDefect("totalNotRecalculated");
  const showsQuantityOne = useDefect("cartShowsQuantityOne");
  const checkoutMissing = useDefect("checkoutLinkMissing");

  useEffect(() => {
    fetch("/api/shop/cart").then((response) => response.json()).then(setCart);
  }, []);

  const update = (next: CartSummary) => {
    setCart(next);
    notifyCartChanged();
  };

  const setQuantity = async (productId: string, value: string) => {
    const quantity = Number(value);
    if (!Number.isFinite(quantity) || value === "") return;
    const response = await fetch("/api/shop/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity })
    });
    const next = (await response.json()) as CartSummary;
    if (totalStale && cart) {
      setCart({
        ...cart,
        lines: cart.lines.map((line) => (line.productId === productId ? { ...line, quantity } : line))
      });
      return;
    }
    update(next);
  };

  const remove = async (productId: string) => {
    const response = await fetch(`/api/shop/cart?productId=${encodeURIComponent(productId)}`, { method: "DELETE" });
    update(await response.json());
  };

  const applyCode = async () => {
    const response = await fetch("/api/shop/cart/discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    if (!response.ok) {
      setCodeError("Invalid discount code.");
      setCodeMessage("");
      const refreshed = await fetch("/api/shop/cart");
      update(await refreshed.json());
      return;
    }
    setCodeError("");
    setCodeMessage(`Code ${code.trim().toUpperCase()} applied.`);
    update(await response.json());
  };

  if (!cart) return <p className="muted">Loading cart...</p>;

  return (
    <section aria-labelledby="cart-heading">
      <h1 id="cart-heading">Your cart</h1>
      {cart.lines.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
                <th scope="col"><span className="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {cart.lines.map((line) => (
                <tr key={line.productId}>
                  <th scope="row">{line.name}</th>
                  <td>{formatPrice(line.price)}</td>
                  <td>
                    <input
                      aria-label={`Quantity for ${line.name}`}
                      className="quantity-input"
                      type="number"
                      min={0}
                      defaultValue={showsQuantityOne ? 1 : line.quantity}
                      onChange={(event) => setQuantity(line.productId, event.target.value)}
                    />
                  </td>
                  <td>{formatPrice(line.lineTotal)}</td>
                  <td>
                    <button aria-label={`Remove ${line.name}`} className="link-button" type="button" onClick={() => remove(line.productId)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-bottom">
            <div className="inline-form">
              <label>
                Discount code
                <input value={code} onChange={(event) => setCode(event.target.value)} />
              </label>
              <button className="secondary-button" type="button" onClick={applyCode}>Apply</button>
            </div>
            {codeError && <p className="error-text" role="alert">{codeError}</p>}
            {codeMessage && <p className="success-text">{codeMessage}</p>}
            <dl className="summary-list">
              <dt>Subtotal</dt>
              <dd data-testid="cart-subtotal">{formatPrice(cart.subtotal)}</dd>
              <dt>Discount</dt>
              <dd data-testid="cart-discount">-{formatPrice(cart.discount)}</dd>
              <dt>Total</dt>
              <dd data-testid="cart-total">{formatPrice(cart.total)}</dd>
            </dl>
            {!checkoutMissing && <Link className="primary-button" href="/shop/checkout">Checkout</Link>}
          </div>
        </>
      )}
    </section>
  );
}
