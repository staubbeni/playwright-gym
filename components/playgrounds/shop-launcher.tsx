import Link from "next/link";
import type { Lesson } from "@/lib/lessons";

const shopPages = [
  { href: "/shop", label: "Catalog", note: "search, filters, product cards" },
  { href: "/shop/products/steel-kettlebell", label: "Product page", note: "stock check, reviews" },
  { href: "/shop/cart", label: "Cart", note: "quantities, discount codes (GYM10, GYM20)" },
  { href: "/shop/checkout", label: "Checkout", note: "validation, shipping, confirm dialog" },
  { href: "/shop/login", label: "Login", note: "student / playwright" },
  { href: "/shop/account", label: "Account", note: "protected, settings, sign out" }
];

const api = [
  "GET /api/shop/products?q=&category=&sort=&page=",
  "GET /api/shop/products/:id",
  "GET | POST | PATCH | DELETE /api/shop/cart",
  "POST /api/shop/cart/discount { code }",
  "POST /api/shop/login { username, password }",
  "POST /api/shop/logout",
  "GET | POST /api/shop/orders",
  "POST /api/shop/reset"
];

export function ShopLauncher({ lesson }: { lesson: Lesson }) {
  return (
    <section className="playground-card" aria-labelledby="shop-launcher-heading">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Practice app</p>
          <h2 id="shop-launcher-heading">Gym Shop</h2>
        </div>
      </div>
      <p className="muted">
        This lesson uses the Gym Shop, a small store with a catalog, cart, checkout and login.
        Your tests start at <code>{lesson.target}</code>. Every browser context gets its own cart.
      </p>
      <ul className="launcher-list">
        {shopPages.map((page) => (
          <li key={page.href}>
            <Link href={page.href}>{page.label}</Link> <span className="muted small">{page.note}</span>
          </li>
        ))}
      </ul>
      <details>
        <summary>API reference</summary>
        <ul className="api-list">
          {api.map((line) => <li key={line}><code>{line}</code></li>)}
        </ul>
      </details>
    </section>
  );
}
