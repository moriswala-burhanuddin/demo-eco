"use client";

import { usePathname } from 'next/navigation';
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/components/smart/CartDrawer";
import { DiscoveryDock } from "@/components/smart/DiscoveryDock";
import { CommandPalette } from "@/components/smart/CommandPalette";
import { CampaignDecorations } from "@/components/smart/CampaignDecorations";
import { CampaignMarquee } from "@/components/smart/CampaignMarquee";

export function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/hq-panel');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <CampaignDecorations />
            <CommandPalette />
            <CampaignMarquee />
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <CartDrawer />
            <DiscoveryDock />
        </>
    );
}
