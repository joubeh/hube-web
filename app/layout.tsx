import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Hube | دنیای هوش مصنوعی",
  description: "دسترسی به مدل های هوش مصنوعی ویژه بدون نیاز به خرید اشتراک",
};

const primary = localFont({
  src: [
    {
      path: "../public/assets/Vazir.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-primary",
});

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
      <body className={`${primary.className}`} dir="rtl">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
