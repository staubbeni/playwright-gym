"use client";

import { useEffect, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { PlaygroundCard } from "./card";

function frameDocument(confirms: boolean, validates: boolean) {
  return `<!doctype html><html><head><style>
body{background:#121a29;color:#e8eef8;font-family:Arial,sans-serif;padding:16px;margin:0}
label{display:block;font-size:13px;margin-top:8px}input{display:block;margin:6px 0;padding:8px;width:220px}
button{margin-top:8px;padding:8px 14px}[role=alert]{color:#ff8a8a}</style></head><body>
<form id="payment" novalidate>
<label for="card">Card number</label><input id="card" inputmode="numeric">
<label for="expiry">Expiry</label><input id="expiry" placeholder="MM/YY">
<button type="submit">Pay now</button>
<div id="error" role="alert"></div>
<div id="result" role="status">Ready for payment.</div>
</form>
<script>
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();
  var card = document.querySelector("#card").value.replace(/\\s/g, "");
  var error = document.querySelector("#error");
  if (${validates} && !/^\\d{16}$/.test(card)) { error.textContent = "Card number must be 16 digits."; return; }
  error.textContent = "";
  if (!${confirms}) return;
  document.querySelector("#result").textContent = "Payment confirmed.";
  parent.postMessage({ type: "payment-confirmed" }, "*");
});
</script></body></html>`;
}

export default function IframePlayground() {
  const bug = useLessonBugs("12-iframe");
  const ignoreMessages = bug(3);
  const [orderStatus, setOrderStatus] = useState("Awaiting payment.");

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "payment-confirmed" && !ignoreMessages) setOrderStatus("Order paid.");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [ignoreMessages]);

  return (
    <PlaygroundCard lessonId="12-iframe" title="Checkout with embedded payment" intro="The card form is a separate document inside an iframe, like a payment provider's widget.">
      <p className="result-panel" role="status" data-testid="order-status">{orderStatus}</p>
      <iframe className="demo-frame" title="Payment form" srcDoc={frameDocument(!bug(1), !bug(2))} />
    </PlaygroundCard>
  );
}
