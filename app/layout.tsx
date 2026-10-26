import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Playwright Gym",
  description: "A hands-on Playwright testing playground."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
