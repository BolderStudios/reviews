import "./styles/globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { Inter as FontSans } from "next/font/google";
import { cn } from "../lib/utils";
import { Toaster } from "sonner";
import SignedInPages from "@/components/SignedInPages";
import { Analytics } from '@vercel/analytics/react';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: {
    default: 'Brand Armor',
    template: '%s | Brand Armor',
  },
  description: 'Brand Armor helps local businesses offer prepaid credits to boost customer loyalty and cash flow.',
  openGraph: {
    title: 'Brand Armor',
    description: 'Brand Armor is a platform that allows local businesses to offer prepaid credit to their customers. We help you get more customers, keep them longer, and make more money.',
    url: 'https://www.getbrandarmor.com',
    siteName: 'BrandArmor',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <main>
            <SignedIn>
              {children}
              <Analytics />
            </SignedIn>
            <SignedOut>
              <div>
                {children}
                <Analytics />
              </div>
            </SignedOut>
            <Toaster richColors />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}