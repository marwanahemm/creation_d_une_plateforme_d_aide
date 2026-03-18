import "./globals.css";

export const metadata = {
  title: "Démarches Admin",
  description: "Tutoriels pas à pas pour vos démarches administratives en ligne.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
