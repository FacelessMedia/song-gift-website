import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { IntakeProvider } from "@/context/IntakeContext";
import { SessionInitializer } from "@/components/SessionInitializer";
import NewsletterPopupManager from "@/components/NewsletterManager";
import { OrganizationSchema } from "@/components/schema/OrganizationSchema";
import { WebSiteSchema } from "@/components/schema/WebSiteSchema";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Custom Song Gift | SongGift",
    template: "%s | SongGift"
  },
  description: "Turn your love story into a personalized song gift. Professional musicians create unique songs from your memories in just days.",
  metadataBase: new URL('https://songgift.app'),
  icons: {
    icon: [
      { url: '/favicon.png?v=3', sizes: 'any' },
      { url: '/icon.png?v=3', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png?v=3',
    shortcut: '/favicon.png?v=3',
  },
  openGraph: {
    title: "Custom Song Gift | SongGift",
    description: "Turn your love story into a personalized song gift. Professional musicians create unique songs from your memories in just days.",
    url: 'https://songgift.app',
    siteName: 'SongGift',
    type: 'website',
    images: [
      {
        url: '/songgift_logo_black.png',
        width: 1200,
        height: 630,
        alt: 'SongGift - Gift a Custom Song',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Custom Song Gift | SongGift",
    description: "Turn your love story into a personalized song gift. Professional musicians create unique songs from your memories in just days.",
    images: ['/songgift_logo_black.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png?v=3" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${dmSans.variable} ${sourceSerif4.variable} antialiased`}
      >
        {/* Structured Data Schema */}
        <OrganizationSchema />
        <WebSiteSchema />
        
        <SessionInitializer />
        <IntakeProvider>
          {children}
        </IntakeProvider>
        <NewsletterPopupManager />
        
        {/* GoHighLevel Chatbot (Hillary) */}
        <Script
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="697dc805a2eb73779455110e"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
