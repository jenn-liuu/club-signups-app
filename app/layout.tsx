import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Club Sign-ups",
  description: "Find a club and sign up.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
