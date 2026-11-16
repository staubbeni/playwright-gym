import { discountCodes, findProduct } from "./catalog";

export type CartLine = { productId: string; quantity: number };
export type Order = { id: string; total: number; items: number; createdAt: string };
type Session = {
  cart: CartLine[];
  discountCode?: string;
  orders: Order[];
  statusChecks: number;
  leftoverSeeded?: boolean;
};

// Next.js may load this module more than once in dev, so state lives on
// globalThis. Shop state is keyed by the gym-sid cookie, which keeps parallel
// tests (each with its own browser context) apart.
type Store = {
  sessions: Map<string, Session>;
  nextOrderId: number;
  lastLogin?: string;
  contextNote?: string;
  contextUser?: string;
  members: string[];
};
const g = globalThis as unknown as { __gymStore?: Store };
const store: Store = (g.__gymStore ??= { sessions: new Map(), nextOrderId: 1001, members: [] });

export function getSession(sid: string): Session {
  let session = store.sessions.get(sid);
  if (!session) {
    session = { cart: [], orders: [], statusChecks: 0 };
    store.sessions.set(sid, session);
  }
  return session;
}

export function resetSession(sid: string) {
  store.sessions.delete(sid);
}

export function cartSummary(session: Session, opts: { ignoreDiscount?: boolean; gym20GivesTen?: boolean } = {}) {
  const lines = session.cart.flatMap((line) => {
    const product = findProduct(line.productId);
    return product
      ? [{ productId: product.id, name: product.name, price: product.price, quantity: line.quantity, lineTotal: round(product.price * line.quantity) }]
      : [];
  });
  const subtotal = round(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  let rate = session.discountCode ? discountCodes[session.discountCode] ?? 0 : 0;
  if (opts.ignoreDiscount) rate = 0;
  if (opts.gym20GivesTen && session.discountCode === "GYM20") rate = 0.1;
  const discount = round(subtotal * rate);
  return {
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal,
    discountCode: session.discountCode ?? null,
    discount,
    total: round(subtotal - discount)
  };
}

export function createOrder(session: Session, total: number, items: number): Order {
  const order = { id: `GYM-${store.nextOrderId++}`, total, items, createdAt: new Date().toISOString() };
  session.orders.unshift(order);
  session.cart = [];
  session.discountCode = undefined;
  return order;
}

export const shared = store;

export function round(value: number) {
  return Math.round(value * 100) / 100;
}
