export type Category = "Apparel" | "Equipment" | "Nutrition";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  sale: boolean;
  description: string;
  reviews: string[];
};

export const products: Product[] = [
  { id: "trail-runner-shoes", name: "Trail Runner Shoes", price: 89, category: "Apparel", sale: true, description: "Grippy, light shoes for muddy morning runs.", reviews: ["Great grip on wet trails.", "Runs a little small.", "Comfortable from day one."] },
  { id: "performance-tee", name: "Performance Tee", price: 24.5, category: "Apparel", sale: false, description: "Breathable shirt that dries in minutes.", reviews: ["Soft and light.", "Survived 50 washes."] },
  { id: "compression-leggings", name: "Compression Leggings", price: 45, category: "Apparel", sale: true, description: "Supportive leggings for long sessions.", reviews: ["Perfect fit.", "No see-through on squats."] },
  { id: "training-hoodie", name: "Training Hoodie", price: 59, category: "Apparel", sale: false, description: "Warm hoodie for outdoor warm-ups.", reviews: ["Cozy.", "Pockets are deep enough for a phone."] },
  { id: "steel-kettlebell", name: "Steel Kettlebell", price: 39.99, category: "Equipment", sale: false, description: "A 12 kg cast steel kettlebell with a wide handle.", reviews: ["Solid grip and perfect weight.", "Paint chipped a little after a month.", "My favourite piece of home equipment."] },
  { id: "yoga-mat", name: "Yoga Mat", price: 29, category: "Equipment", sale: false, description: "Non-slip 6 mm mat.", reviews: ["Does not slide.", "Smells a bit at first."] },
  { id: "travel-yoga-mat", name: "Travel Yoga Mat", price: 35, category: "Equipment", sale: false, description: "Foldable mat that fits in a backpack.", reviews: ["Thin but useful."] },
  { id: "resistance-bands", name: "Resistance Bands", price: 19.99, category: "Equipment", sale: true, description: "Five bands from light to extra heavy.", reviews: ["Great value.", "The heavy one is really heavy."] },
  { id: "adjustable-dumbbell", name: "Adjustable Dumbbell", price: 149, category: "Equipment", sale: false, description: "From 2 to 24 kg with a twist.", reviews: ["Saves so much space."] },
  { id: "whey-protein", name: "Whey Protein", price: 54.9, category: "Nutrition", sale: false, description: "1 kg vanilla whey protein.", reviews: ["Mixes well.", "Too sweet for me."] },
  { id: "energy-bar-box", name: "Energy Bar Box", price: 18, category: "Nutrition", sale: false, description: "Twelve oat and honey bars.", reviews: ["Good before a long ride."] },
  { id: "electrolyte-mix", name: "Electrolyte Mix", price: 12.5, category: "Nutrition", sale: false, description: "Lemon electrolyte powder, 20 servings.", reviews: ["Tastes like lemonade."] }
];

export const PAGE_SIZE = 8;

export const discountCodes: Record<string, number> = { GYM10: 0.1, GYM20: 0.2 };

export const shippingByCountry: Record<string, number> = { HU: 5, DE: 8, US: 15 };

export const countries = [
  { code: "HU", name: "Hungary" },
  { code: "DE", name: "Germany" },
  { code: "US", name: "United States" }
];

export const users: Record<string, string> = { student: "playwright" };

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function findProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function shippingFor(country: string, express: boolean, usShippingWrong = false, germanyExpressWrong = false): number {
  const base = usShippingWrong && country === "US" ? 5 : shippingByCountry[country] ?? 0;
  const surcharge = germanyExpressWrong && country === "DE" ? 5 : 10;
  return base + (express ? surcharge : 0);
}
