import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { IntakeProvider } from "@/context/IntakeContext";

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
    default: "SongGift | Gift a Custom Song",
    template: "%s | SongGift"
  },
  description: "Create personalized custom songs for your loved ones. Professional musicians craft unique songs based on your memories, emotions, and stories.",
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
    title: "SongGift | Gift a Custom Song",
    description: "Create personalized custom songs for your loved ones. Professional musicians craft unique songs based on your memories, emotions, and stories.",
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
    title: "SongGift | Gift a Custom Song",
    description: "Create personalized custom songs for your loved ones. Professional musicians craft unique songs based on your memories, emotions, and stories.",
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
        <IntakeProvider>
          {children}
        </IntakeProvider>
      </body>
    </html>
  );
}
