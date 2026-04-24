import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gradion AI Platform",
  description:
    "Internal AI Knowledge Platform — Scaling Business with Digital and Deep Tech",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
