import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEAR Farm",
  description: "2D farming game on NEAR blockchain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
