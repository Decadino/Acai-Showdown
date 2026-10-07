import type { Metadata } from "next";
import "./globals.css";
import "./fruity.css";
import "./cafe-polish.css";

export const metadata: Metadata = {
  title: "Açaí Showdown — The Bowl Studio",
  description: "A multiplayer bowl-making party game. Build colorful bowls, vote anonymously, and win with friends.",
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
