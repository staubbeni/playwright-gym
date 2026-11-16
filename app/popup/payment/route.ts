import { isBug } from "@/lib/bug-server";

// A plain HTML page (no React), like a third-party payment provider's window.
const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Payment window</title>
<style>body{background:#0b101a;color:#e8eef8;font-family:Arial,sans-serif;padding:2rem}
button{background:#8b7cff;border:0;border-radius:8px;color:#fff;font-weight:700;padding:.8rem 1rem;cursor:pointer}</style></head>
<body>
<h1>Payment window</h1>
<p>Amount due: $49.00</p>
<button type="button" id="approve">Approve payment</button>
<script>
document.getElementById("approve").addEventListener("click", function () {
  if (window.opener) window.opener.postMessage({ type: "payment-approved" }, window.location.origin);
  window.close();
});
</script>
</body>
</html>`;

export function GET(request: Request) {
  // 14-popups:2.2 leaves the popup open after approval.
  const body = isBug(request, ["14-popups:2.2"]) ? html.replace("  window.close();\n", "") : html;
  return new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
