import type { Metadata } from "next";
import { Sora, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const libre = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre",
  display: "swap",
});

export const metadata: Metadata = {
  title: "S&N Studio — Web Development",
  description:
    "Budujemy strony dla lokalnych firm. Profesjonalnie, szybko i w cenie od 800 PLN.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${sora.variable} ${libre.variable}`}>
      <body>{children}</body>
    </html>
  );
}
