import { create } from 'zustand';

interface Theme {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    background_color: string;
    surface_color: string;
    text_color: string;
    border_color: string;
    border_radius: string;
}

interface Banner {
    placement: string;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    text_position: string;
    use_overlay: boolean;
    desktop_image_url: string;
    mobile_image_url: string;
}

interface Decoration {
    placement: string;
    opacity: number;
    animation: string;
    asset_url: string;
}

interface Campaign {
    id: number;
    name: string;
    slug: string;
    theme: Theme;
    banners: Banner[];
    decorations: Decoration[];
    offer_id: number;
}

interface CampaignStore {
    activeCampaign: Campaign | null;
    isLoading: boolean;
    fetchActiveCampaign: () => Promise<void>;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
    activeCampaign: null,
    isLoading: true,
    fetchActiveCampaign: async () => {
        try {
            const res = await fetch('http://localhost:8000/api/v1/campaigns/active/');
            if (res.ok) {
                if (res.status === 204) {
                    set({ activeCampaign: null, isLoading: false });
                } else {
                    const data = await res.json();
                    set({ activeCampaign: data, isLoading: false });
                }
            } else {
                set({ activeCampaign: null, isLoading: false });
            }
        } catch (error) {
            console.error('Failed to fetch campaign:', error);
            set({ activeCampaign: null, isLoading: false });
        }
    }
}));
