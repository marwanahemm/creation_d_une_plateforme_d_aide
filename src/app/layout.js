import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Démarches administratives — Guides pas à pas · Site non officiel",
  description: "Guides pas à pas pour vos démarches administratives en ligne : Ameli, CAF, France Travail. Gratuit, sans inscription.",
  verification: {
    google: 'ILBmzNErgtbVwY-D8KwE6c43vWjuHkhZt-RkcysmfmE',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}