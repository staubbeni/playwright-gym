import { Suspense } from "react";
import { Login } from "@/components/shop/login";
import { ShopFrame } from "@/components/shop/shop-frame";

export default function LoginPage() {
  return (
    <ShopFrame>
      <Suspense>
        <Login />
      </Suspense>
    </ShopFrame>
  );
}
