import { sessionId } from "@/lib/bug-server";
import { discountCodes } from "@/lib/shop/catalog";
import { defectActive } from "@/lib/shop/server";
import { cartSummary, getSession } from "@/lib/shop/store";

export async function POST(request: Request) {
  const { code = "" } = (await request.json().catch(() => ({}))) as { code?: string };
  const normalized = defectActive("lowercaseCodeRejected", request) ? code.trim() : code.trim().toUpperCase();
  const session = getSession(sessionId(request));
  if (!(normalized in discountCodes)) {
    session.discountCode = undefined;
    return Response.json({ error: "Invalid discount code." }, { status: 400 });
  }
  session.discountCode = normalized;
  return Response.json(
    cartSummary(session, {
      ignoreDiscount: defectActive("discountIgnored", request),
      gym20GivesTen: defectActive("gym20GivesTen", request)
    })
  );
}
