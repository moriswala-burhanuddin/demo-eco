"use client";

import { useCampaignStore } from "@/store/campaignStore";

export function CampaignMarquee() {
    const { activeCampaign } = useCampaignStore();

    if (!activeCampaign) return null;

    const marqueeDeco = activeCampaign.decorations?.find(d => d.animation === 'MARQUEE');
    if (!marqueeDeco) return null;

    // Use a banner subtitle or campaign name as the text
    const text = activeCampaign.banners?.[0]?.subtitle || `${activeCampaign.name.toUpperCase()} IS LIVE!`;

    return (
        <div className="w-full bg-campaign-primary text-campaign-surface py-3 overflow-hidden whitespace-nowrap flex border-b-2 border-campaign-accent">
            <div className="animate-marquee flex shrink-0 gap-8 font-heading text-sm md:text-lg tracking-[0.2em] uppercase font-bold px-8">
                {Array.from({ length: 15 }).map((_, i) => (
                    <span key={i} className="flex items-center gap-8">
                        {text} <span>•</span>
                    </span>
                ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="animate-marquee flex shrink-0 gap-8 font-heading text-sm md:text-lg tracking-[0.2em] uppercase font-bold px-8">
                {Array.from({ length: 15 }).map((_, i) => (
                    <span key={i} className="flex items-center gap-8">
                        {text} <span>•</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
