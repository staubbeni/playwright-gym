import Link from "next/link";
import { BugProvider } from "@/components/bug-provider";
import { serverFlags } from "@/lib/bug-server";
import { ShopHeader } from "./shop-header";

// Server wrapper for every shop page: resolves bug flags per request so they
// stay correct across client-side navigations.
export function ShopFrame({ children }: { children: React.ReactNode }) {
  const flags = serverFlags();
  return (
    <BugProvider flags={flags}>
      <div className="shop-shell">
        <ShopHeader />
        <main className="shop-main">{children}</main>
        <footer className="shop-footer">
          Gym Shop is a practice app.{" "}
          <Link href="/">Back to the course</Link>
          {flags.length > 0 && <span className="status-pill">Bug mode: {flags.join(", ")}</span>}
        </footer>
      </div>
    </BugProvider>
  );
}
