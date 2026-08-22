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
  title: "کارت دعوت",
  description: "یک شب، یک آغاز و هزار آرزوی شیرین پیش روی ماست; کنارمان باشید تا این آغاز، خاطره‌ای برای همیشه شود.",
  openGraph: {
    title: "کارت دعوت",
    description: "یک شب، یک آغاز و هزار آرزوی شیرین پیش روی ماست; کنارمان باشید تا این آغاز، خاطره‌ای برای همیشه شود.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* جلوگیری از اسکرین‌شات در برخی مرورگرها */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        {/* جلوگیری از ذخیره‌سازی صفحه */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        {/* جلوگیری از اسکرین‌شات در iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:site_name" content="کارت دعوت" />
        {/* جلوگیری از درگ و انتخاب */}
        <style>{`
          * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
          }
          img, video, canvas {
            -webkit-user-drag: none !important;
            user-drag: none !important;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
