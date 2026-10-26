import { sessionId } from "@/lib/bug-server";
import { defectActive } from "@/lib/shop/server";
import { shippingFor } from "@/lib/shop/catalog";
import { cartSummary, createOrder, getSession, round } from "@/lib/shop/store";

type Checkout = { name?: string; email?: string; address?: string; country?: string; delivery?: string };

export function GET(request: Request) {
  return Response.json({ orders: getSession(sessionId(request)).orders });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Checkout;
  const session = getSession(sessionId(request));
  const errors: Record<string, string> = {};
  if (!body.name?.trim()) errors.name = "Full name is required.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email ?? "") && !defectActive("checkoutAcceptsInvalidEmail", request)) {
    errors.email = "Enter a valid email address.";
  }
  if (!body.address?.trim()) errors.address = "Address is required.";
  if (session.cart.length === 0) errors.cart = "Your cart is empty.";
  if (Object.keys(errors).length > 0) return Response.json({ errors }, { status: 422 });

  const summary = cartSummary(session, {
    ignoreDiscount: defectActive("discountIgnored", request),
    gym20GivesTen: defectActive("gym20GivesTen", request)
  });
  const shipping = shippingFor(body.country ?? "", body.delivery === "express", defectActive("usShippingWrong", request));
  const order = createOrder(session, round(summary.total + shipping), summary.count);
  return Response.json(order, { status: 201 });
}
