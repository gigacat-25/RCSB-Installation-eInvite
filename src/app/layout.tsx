import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { META, EVENT } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  metadataBase: new URL(META.url),
  openGraph: {
    title: META.title,
    description: META.description,
    url: META.url,
    siteName: "UGAMA AARAMBHA",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: META.ogImage,
        width: 1200,
        height: 630,
        alt: `UGAMA AARAMBHA — ${EVENT.fullTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: META.title,
    description: META.description,
    images: [META.ogImage],
  },
  robots: {
    index: false, // private invite — do not index
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${playfair.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
