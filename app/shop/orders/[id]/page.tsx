import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShopFrame } from "@/components/shop/shop-frame";
import { SID_HEADER } from "@/lib/bug";
import { formatPrice } from "@/lib/shop/catalog";
import { defectActive } from "@/lib/shop/server";
import { getSession } from "@/lib/shop/store";

export default function OrderPage({ params }: { params: { id: string } }) {
  const order = getSession(headers().get(SID_HEADER) ?? "anonymous").orders.find((item) => item.id === params.id);
  if (!order) notFound();
  return (
    <ShopFrame>
      <section aria-labelledby="order-heading" className="narrow-card">
        <h1 id="order-heading">Order confirmed</h1>
        {!defectActive("orderNumberMissing") && <p>Order number: {order.id}</p>}
        <p>Total paid: {formatPrice(order.total)}</p>
        <p>Items: {order.items}</p>
        <Link href="/shop/orders">View all orders</Link>
      </section>
    </ShopFrame>
  );
}
