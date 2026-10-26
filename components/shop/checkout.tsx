"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { countries, formatPrice, shippingFor } from "@/lib/shop/catalog";
import type { CartSummary } from "./cart";
import { useDefect } from "./use-defect";

type Errors = Partial<Record<"name" | "email" | "address" | "cart", string>>;

export function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [form, setForm] = useState({ name: "", email: "", address: "", country: "HU", delivery: "standard" });
  const [errors, setErrors] = useState<Errors>({});
  const usShippingWrong = useDefect("usShippingWrong");

  useEffect(() => {
    fetch("/api/shop/cart").then((response) => response.json()).then(setCart);
  }, []);

  const shipping = shippingFor(form.country, form.delivery === "express", usShippingWrong);
  const total = (cart?.total ?? 0) + shipping;
  const set = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: event.target.value });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!window.confirm(`Place order for ${formatPrice(total)}?`)) return;
    const response = await fetch("/api/shop/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = (await response.json()) as { id?: string; errors?: Errors };
    if (!response.ok || !data.id) {
      setErrors(data.errors ?? {});
      return;
    }
    router.push(`/shop/orders/${data.id}`);
  };

  return (
    <section aria-labelledby="checkout-heading" className="checkout">
      <h1 id="checkout-heading">Checkout</h1>
      <form className="form-stack" noValidate onSubmit={submit}>
        <label htmlFor="checkout-name">Full name</label>
        <input id="checkout-name" value={form.name} onChange={set("name")} aria-invalid={Boolean(errors.name)} />
        {errors.name && <p className="error-text" role="alert">{errors.name}</p>}
        <label htmlFor="checkout-email">Email</label>
        <input id="checkout-email" type="email" value={form.email} onChange={set("email")} aria-invalid={Boolean(errors.email)} />
        {errors.email && <p className="error-text" role="alert">{errors.email}</p>}
        <label htmlFor="checkout-address">Address</label>
        <input id="checkout-address" value={form.address} onChange={set("address")} aria-invalid={Boolean(errors.address)} />
        {errors.address && <p className="error-text" role="alert">{errors.address}</p>}
        <label htmlFor="checkout-country">Country</label>
        <select id="checkout-country" value={form.country} onChange={set("country")}>
          {countries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}
        </select>
        <fieldset>
          <legend>Delivery</legend>
          <label className="checkbox-row">
            <input type="radio" name="delivery" value="standard" checked={form.delivery === "standard"} onChange={set("delivery")} />
            Standard (free)
          </label>
          <label className="checkbox-row">
            <input type="radio" name="delivery" value="express" checked={form.delivery === "express"} onChange={set("delivery")} />
            Express (+$10.00)
          </label>
        </fieldset>
        <dl className="summary-list">
          <dt>Subtotal</dt>
          <dd data-testid="checkout-subtotal">{formatPrice(cart?.total ?? 0)}</dd>
          <dt>Shipping</dt>
          <dd data-testid="checkout-shipping">{formatPrice(shipping)}</dd>
          <dt>Total</dt>
          <dd data-testid="checkout-total">{formatPrice(total)}</dd>
        </dl>
        {errors.cart && <p className="error-text" role="alert">{errors.cart}</p>}
        <button className="primary-button" type="submit">Place order</button>
      </form>
    </section>
  );
}
