import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import {
  APP_DESCRIPTION,
  APP_NAME,
  APPLE_TOUCH_ICON_PATH,
  BRAND_COLOR,
  FAVICON_PATH,
  ICON_192_PATH,
  ICON_512_PATH,
} from "@/lib/constants";
import { DEFAULT_OG_IMAGE_PATH, getSiteUrl } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${APP_NAME} | Wedding Dress Hire & Event Planning in Blantyre`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "wedding dress hire Blantyre",
    "bridal gowns Malawi",
    "AHAVAH bridal",
    "custom wedding dress",
    "event planning Blantyre",
    "wedding fittings",
  ],
  authors: [{ name: `${APP_NAME} Bridal Emporium` }],
  creator: APP_NAME,
  publisher: APP_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "5d7pyQzj15cLh_mFUkFmsL4v71TAClRDKQnqciDXVRU",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_MW",
    url: "/",
    siteName: APP_NAME,
    title: `${APP_NAME} | Wedding Dress Hire & Event Planning in Blantyre`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        alt: `${APP_NAME} bridal wear and wedding planning`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | Wedding Dress Hire & Event Planning in Blantyre`,
    description: APP_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: FAVICON_PATH, sizes: "32x32", type: "image/png" },
      { url: ICON_192_PATH, sizes: "192x192", type: "image/png" },
      { url: ICON_512_PATH, sizes: "512x512", type: "image/png" },
    ],
    shortcut: FAVICON_PATH,
    apple: [{ url: APPLE_TOUCH_ICON_PATH, sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AHAVAH",
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLOR,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${cormorant.variable} min-h-screen antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
