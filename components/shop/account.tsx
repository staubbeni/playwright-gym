"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDefect } from "./use-defect";

export function Account({ user }: { user: string }) {
  const router = useRouter();
  const [newsletter, setNewsletter] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [toast, setToast] = useState("");
  const toastMissing = useDefect("settingsToastMissing");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const signOut = async () => {
    await fetch("/api/shop/logout", { method: "POST" });
    router.push("/shop/login");
    router.refresh();
  };

  return (
    <section aria-labelledby="account-heading" className="narrow-card">
      <h1 id="account-heading">My account</h1>
      <p>Signed in as {user}</p>
      <fieldset className="form-stack">
        <legend>Settings</legend>
        <label className="checkbox-row">
          <input type="checkbox" role="switch" checked={newsletter} onChange={(event) => setNewsletter(event.target.checked)} />
          Newsletter
        </label>
        <label className="checkbox-row">
          <input type="checkbox" role="switch" checked={orderUpdates} onChange={(event) => setOrderUpdates(event.target.checked)} />
          Order updates
        </label>
        <button className="primary-button" type="button" onClick={() => !toastMissing && setToast("Settings saved.")}>
          Save settings
        </button>
      </fieldset>
      <div className="button-row">
        <Link className="secondary-button" href="/shop/orders">View orders</Link>
        <button className="secondary-button" type="button" onClick={signOut}>Sign out</button>
      </div>
      <div className="toast-region" role="region" aria-label="Notifications">
        {toast && <div className="toast" role="status">{toast}</div>}
      </div>
    </section>
  );
}
