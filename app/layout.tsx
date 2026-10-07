import { ViewTransition } from "react";
import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import { OfflineBanner } from "@/components/OfflineBanner";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Plantagotchi — Descubra sua planta",
    template: "%s · Plantagotchi",
  },
  description:
    "Fotografe uma planta e descubra a espécie, os cuidados e possíveis sinais de que ela precisa de atenção. Projeto da Feira de Ciências do Colégio MAF.",
  applicationName: "Plantagotchi",
  appleWebApp: {
    capable: true,
    title: "Plantagotchi",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2ede3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${instrumentSans.variable} ${plexMono.variable} antialiased`}
    >
      <body className="paper-grain">
        <OfflineBanner />
        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col pb-[calc(var(--nav-h)+var(--safe-bottom)+1rem)]">
          {/* "leave-home" (Safari only, set by BottomNav) skips the fade: Safari lets the
              animated mascot linger over the outgoing page. */}
          <ViewTransition default={{ "leave-home": "none", default: "page-fade" }}>{children}</ViewTransition>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
