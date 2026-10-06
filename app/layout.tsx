import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Açaí Showdown — The Bowl Studio",
  description: "A multiplayer bowl-making party game. Decorate for 60 seconds, vote anonymously, and win with friends.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
