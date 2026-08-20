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
  title: "کارت دعوت عروسی",
  description: "یک شب، یک آغاز و هزار آرزوی شیرین پیش روی ماست; کنارمان باشید تا این آغاز، خاطره ای برای همیشه شود.",
  openGraph: {
    title: "کارت دعوت عروسی",
    description: "یک شب، یک آغاز و هزار آرزوی شیرین پیش روی ماست...",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* متا تگ‌های Viewport و امنیت */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* متا تگ‌های امنیتی */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Your Name" />
        
        {/* OG Tags */}
        <meta property="og:title" content="کارت دعوت عروسی" />
        <meta property="og:description" content="یک شب، یک آغاز و هزار آرزوی شیرین..." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />
        
        {/* فونت‌ها */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        {/* استایل‌های عمومی */}
        <style>{`
          * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
          }
          
          img, video, canvas, svg {
            -webkit-user-drag: none !important;
            user-drag: none !important;
            pointer-events: none !important;
          }
          
          ::selection {
            background: transparent !important;
          }
          ::-moz-selection {
            background: transparent !important;
          }
          
          body {
            background: linear-gradient(135deg, #fdf6e3 0%, #f5e6d3 100%);
            min-height: 100vh;
            font-family: 'Vazirmatn', sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          
          @media print {
            body { display: none !important; }
          }
        `}</style>
        
        {/* اسکریپت‌های امنیتی */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
              document.addEventListener('keydown', function(e) {
                if (e.key === 'PrintScreen' || e.key === 'F12' || (e.ctrlKey && e.key === 'p')) {
                  e.preventDefault();
                  return false;
                }
              });
              document.addEventListener('copy', function(e) { e.preventDefault(); });
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}