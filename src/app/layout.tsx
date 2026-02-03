import type { Metadata } from "next";
import { Pinyon_Script, Didact_Gothic } from "next/font/google";
import "./globals.css";

const pinyon = Pinyon_Script({
  weight: "400",
  variable: "--font-pinyon",
  subsets: ["latin"],
});

const didact = Didact_Gothic({
  weight: "400",
  variable: "--font-didact",
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
        className={`${pinyon.variable} ${didact.variable} antialiased bg-white text-slate-800 font-body overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900`}
      >
        {children}
      </body>
    </html>
  );
}
