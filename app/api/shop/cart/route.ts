import { sessionId } from "@/lib/bug-server";
import { findProduct } from "@/lib/shop/catalog";
import { defectActive } from "@/lib/shop/server";
import { cartSummary, getSession } from "@/lib/shop/store";

function sessionFor(request: Request) {
  const session = getSession(sessionId(request));
  if (defectActive("cartStartsWithLeftover", request) && !session.leftoverSeeded) {
    session.leftoverSeeded = true;
    session.cart.push({ productId: "energy-bar-box", quantity: 1 });
  }
  return session;
}

function summary(request: Request) {
  return cartSummary(sessionFor(request), {
    ignoreDiscount: defectActive("discountIgnored", request),
    gym20GivesTen: defectActive("gym20GivesTen", request)
  });
}

export function GET(request: Request) {
  return Response.json(summary(request));
}

// Adds a product: { productId, quantity = 1 }
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { productId?: string; quantity?: number };
  const product = body.productId ? findProduct(body.productId) : undefined;
  if (!product) {
    return defectActive("cartAcceptsUnknownProduct", request)
      ? Response.json(summary(request), { status: 201 })
      : Response.json({ error: "Unknown product." }, { status: 400 });
  }
  const quantity = defectActive("cartPostIgnoresQuantity", request) ? 1 : Math.max(1, Number(body.quantity ?? 1));
  const session = sessionFor(request);
  const line = session.cart.find((item) => item.productId === product.id);
  if (line) line.quantity += quantity;
  else session.cart.push({ productId: product.id, quantity });
  return Response.json(summary(request), { status: 201 });
}

// Sets a quantity: { productId, quantity }. Quantity 0 removes the line.
export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { productId?: string; quantity?: number };
  const session = sessionFor(request);
  const line = session.cart.find((item) => item.productId === body.productId);
  if (!line) return Response.json({ error: "Product is not in the cart." }, { status: 404 });
  const quantity = Math.max(0, Math.floor(Number(body.quantity ?? 0)));
  if (quantity === 0) session.cart = session.cart.filter((item) => item !== line);
  else line.quantity = quantity;
  return Response.json(summary(request));
}

// DELETE ?productId=<id> removes one line; without it the cart is cleared.
export function DELETE(request: Request) {
  const productId = new URL(request.url).searchParams.get("productId");
  const session = sessionFor(request);
  if (!productId) {
    session.cart = [];
    session.discountCode = undefined;
  } else if (!defectActive("removeIgnored", request)) {
    session.cart = session.cart.filter((item) => item.productId !== productId);
  }
  return Response.json(summary(request));
}
