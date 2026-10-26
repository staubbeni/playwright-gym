"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CART_CHANGED, useDefect } from "./use-defect";

export function ShopHeader() {
  const [count, setCount] = useState<number | null>(null);
  const cartLinkWrong = useDefect("cartLinkWrong");
  const cartBadgeStale = useDefect("cartBadgeStale");

  useEffect(() => {
    const load = () =>
      fetch("/api/shop/cart")
        .then((response) => response.json())
        .then((cart: { count: number }) => setCount(cart.count))
        .catch(() => undefined);
    load();
    if (cartBadgeStale) return;
    window.addEventListener(CART_CHANGED, load);
    return () => window.removeEventListener(CART_CHANGED, load);
  }, [cartBadgeStale]);

  return (
    <header className="shop-header">
      <Link className="shop-brand" href="/shop">
        <span className="brand-mark">GS</span> Gym Shop
      </Link>
      <nav aria-label="Shop" className="shop-nav">
        <Link href="/shop">Catalog</Link>
        <Link href="/shop/orders">Orders</Link>
        <Link href="/shop/account">Account</Link>
        <Link className="cart-link" href={cartLinkWrong ? "/shop/orders" : "/shop/cart"}>
          {count === null ? "Cart" : `Cart (${count})`}
        </Link>
      </nav>
    </header>
  );
}
