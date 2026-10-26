import { redirect } from "next/navigation";
import { Account } from "@/components/shop/account";
import { ShopFrame } from "@/components/shop/shop-frame";
import { currentUser, defectActive } from "@/lib/shop/server";

export default function AccountPage() {
  const user = currentUser();
  if (!user && !defectActive("accountNoRedirect")) redirect("/shop/login?next=/shop/account");
  return (
    <ShopFrame>
      <Account user={user ?? "guest"} />
    </ShopFrame>
  );
}
