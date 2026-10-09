import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { formatCurrency } from "@/lib/currency";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burhani — Modern Fashion Destination",
  description: `Discover premium fashion essentials. Quality fabrics, thoughtful design, effortless style. Free shipping on orders over ${formatCurrency(150)}.`,
};

import { StoreLayoutWrapper } from "@/components/shared/StoreLayoutWrapper";
import { CampaignProvider } from "@/components/providers/CampaignProvider";
import { CompareTray } from "@/components/smart/CompareTray";
import { CompareModal } from "@/components/smart/CompareModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CampaignProvider>
          <StoreLayoutWrapper>
              {children}
              <CompareTray />
              <CompareModal />
          </StoreLayoutWrapper>
        </CampaignProvider>
      </body>
    </html>
  );
}
