import type { Metadata } from "next";
import { Sora, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";

// SSR disabled — Three.js and browser APIs are client-only
const SceneCanvas = dynamic(() => import("@/components/SceneCanvas"), {
  ssr: false,
});

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
    "Budujemy strony dla lokalnych firm. Profesjonalnie, szybko i w cenie od 750 PLN.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${sora.variable} ${libre.variable}`}>
      <body>
        <SmoothScroll>
          {/* Fixed WebGL canvas — z:0, behind all page content */}
          <SceneCanvas />
          {/* Content layer — z:1, creates stacking context above canvas */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
