import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Inter, Vazirmatn } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: "Hube | دنیای هوش مصنوعی",
  description: "دسترسی به مدل های هوش مصنوعی ویژه بدون نیاز به خرید اشتراک",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body dir="rtl" className="font-main">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
