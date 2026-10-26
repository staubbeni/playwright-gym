"use client";

import { useBug } from "@/components/bug-provider";
import { defects, type Defect } from "@/lib/shop/defects";

export function useDefect(defect: Defect): boolean {
  return useBug(defects[defect]);
}

export const CART_CHANGED = "gym-cart-changed";

export function notifyCartChanged() {
  window.dispatchEvent(new Event(CART_CHANGED));
}
