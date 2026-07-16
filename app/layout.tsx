import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Sora, Manrope } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${manrope.variable}`}>
      <body>

        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />

      </body>
    </html>
  );
}
