import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gym Shop" };
export const dynamic = "force-dynamic";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
