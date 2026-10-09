"use client";

import { useCampaignStore } from "@/store/campaignStore";
import Link from "next/link";
import Image from "next/image";

interface DynamicBannerProps {
    placement: string;
}

export function DynamicBanner({ placement }: DynamicBannerProps) {
    const { activeCampaign } = useCampaignStore();

    if (!activeCampaign) return null;

    const banner = activeCampaign.banners.find(b => b.placement === placement);
    
    if (!banner) return null;

    const hasImage = !!(banner.desktop_image_url || banner.mobile_image_url);

    return (
        <div className="px-4 md:px-8 py-6">
            <div className="relative w-full overflow-hidden bg-campaign-primary group border border-campaign-accent/20 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
                
                {/* Base Background: Subtle Mesh Gradient (if no image) */}
            {!hasImage && (
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] bg-campaign-secondary/30 rounded-full blur-[120px] mix-blend-screen" />
                    <div className="absolute bottom-[-50%] right-[-10%] w-[80%] h-[120%] bg-campaign-accent/20 rounded-full blur-[100px] mix-blend-screen" />
                </div>
            )}

            {/* Pattern Overlay (if no image) */}
            {!hasImage && (
                <div className="absolute inset-0 z-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--campaign-surface)_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
            )}

            {/* Image Layer */}
            <div className="absolute inset-0 z-0">
                {banner.desktop_image_url && (
                    <img 
                        src={`http://localhost:8000${banner.desktop_image_url}`} 
                        alt={banner.title}
                        className="w-full h-full object-cover hidden md:block transition-transform duration-1000 group-hover:scale-105"
                    />
                )}
                {banner.mobile_image_url && (
                    <img 
                        src={`http://localhost:8000${banner.mobile_image_url}`} 
                        alt={banner.title}
                        className="w-full h-full object-cover block md:hidden transition-transform duration-1000 group-hover:scale-105"
                    />
                )}
            </div>

            {/* Overlay */}
            {banner.use_overlay && hasImage && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 transition-opacity duration-500"></div>
            )}

            {/* Content Layer */}
            <div className="relative z-20 w-full h-full min-h-[350px] md:min-h-[500px] flex items-center px-6 md:px-16 lg:px-24">
                <div className={`w-full max-w-4xl flex flex-col justify-center ${
                    banner.text_position === 'LEFT' ? 'items-start text-left mx-0' :
                    banner.text_position === 'RIGHT' ? 'items-end text-right ml-auto' :
                    'items-center text-center mx-auto'
                }`}>
                    
                    {banner.subtitle && (
                        <div className="mb-4 md:mb-6 overflow-hidden">
                            <span className="inline-block text-campaign-accent font-bold tracking-[0.3em] uppercase text-xs md:text-sm bg-campaign-surface/10 px-4 py-1.5 backdrop-blur-md rounded-full border border-campaign-accent/30 shadow-lg">
                                {banner.subtitle}
                            </span>
                        </div>
                    )}
                    
                    {banner.title && (
                        <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading text-campaign-surface leading-[0.9] tracking-tighter uppercase mb-6 md:mb-10 drop-shadow-2xl mix-blend-normal">
                            {banner.title.split(' ').map((word, i) => (
                                <span key={i} className={i % 2 === 1 ? 'text-transparent bg-clip-text bg-gradient-to-b from-campaign-surface to-campaign-surface/60' : ''}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h2>
                    )}
                    
                    {banner.cta_text && banner.cta_link && (
                        <Link 
                            href={banner.cta_link}
                            className="group/btn relative inline-flex items-center justify-center px-10 py-5 bg-campaign-surface text-campaign-primary font-bold uppercase tracking-widest text-sm overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-campaign-accent/30 hover:shadow-xl"
                            style={{ borderRadius: 'var(--campaign-radius, 9999px)' }}
                        >
                            <span className="relative z-10">{banner.cta_text}</span>
                            <div className="absolute inset-0 h-full w-0 bg-campaign-accent transition-all duration-300 ease-out group-hover/btn:w-full z-0"></div>
                            <span className="relative z-10 ml-3 group-hover/btn:translate-x-2 transition-transform duration-300 group-hover/btn:text-campaign-primary">
                                &rarr;
                            </span>
                        </Link>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
}
