import { headers } from "next/headers";
import Link from "next/link";
import { ShopFrame } from "@/components/shop/shop-frame";
import { SID_HEADER } from "@/lib/bug";
import { formatPrice } from "@/lib/shop/catalog";
import { getSession } from "@/lib/shop/store";

export default function OrdersPage() {
  const orders = getSession(headers().get(SID_HEADER) ?? "anonymous").orders;
  return (
    <ShopFrame>
      <section aria-labelledby="orders-heading">
        <h1 id="orders-heading">Orders</h1>
        {orders.length === 0 ? (
          <p>You have no orders yet. <Link href="/shop">Start shopping</Link></p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th scope="col">Order</th><th scope="col">Items</th><th scope="col">Total</th><th scope="col">Status</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <th scope="row"><Link href={`/shop/orders/${order.id}`}>{order.id}</Link></th>
                  <td>{order.items}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td>Processing</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </ShopFrame>
  );
}
