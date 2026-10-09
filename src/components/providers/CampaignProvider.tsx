"use client";

import { useEffect } from "react";
import { useCampaignStore } from "@/store/campaignStore";

export function CampaignProvider({ children }: { children: React.ReactNode }) {
    const { activeCampaign, fetchActiveCampaign } = useCampaignStore();

    useEffect(() => {
        fetchActiveCampaign();
    }, [fetchActiveCampaign]);

    useEffect(() => {
        if (activeCampaign && activeCampaign.theme) {
            const root = document.documentElement;
            const t = activeCampaign.theme;
            
            // Map our theme properties to CSS variables
            root.style.setProperty('--campaign-primary', t.primary_color);
            root.style.setProperty('--campaign-secondary', t.secondary_color);
            root.style.setProperty('--campaign-accent', t.accent_color);
            root.style.setProperty('--campaign-background', t.background_color);
            root.style.setProperty('--campaign-surface', t.surface_color);
            root.style.setProperty('--campaign-text', t.text_color);
            root.style.setProperty('--campaign-border', t.border_color);
            root.style.setProperty('--campaign-radius', t.border_radius);
        } else {
            // Remove overrides so globals.css defaults take over
            const root = document.documentElement;
            root.style.removeProperty('--campaign-primary');
            root.style.removeProperty('--campaign-secondary');
            root.style.removeProperty('--campaign-accent');
            root.style.removeProperty('--campaign-background');
            root.style.removeProperty('--campaign-surface');
            root.style.removeProperty('--campaign-text');
            root.style.removeProperty('--campaign-border');
            root.style.removeProperty('--campaign-radius');
        }
    }, [activeCampaign]);

    return <>{children}</>;
}
