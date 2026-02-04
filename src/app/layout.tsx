import type { Metadata } from "next";
import { Cinzel, Monsieur_La_Doulaise, Quicksand } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  weight: ["400", "500", "700"],
  variable: "--font-title",
  subsets: ["latin"],
});

const monsieur = Monsieur_La_Doulaise({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invitación Ruby - Mis 15 Años",
  description: "Acompáñame a celebrar mis 15 años.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${cinzel.variable} ${monsieur.variable} ${quicksand.variable} antialiased bg-white text-slate-800 font-body overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900`}
      >
        {children}
      </body>
    </html>
  );
}
