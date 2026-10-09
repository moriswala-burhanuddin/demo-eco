"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";

interface Offer {
    id: number;
    name: string;
}

export default function CreateCampaign() {
    const router = useRouter();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("DRAFT");
    const [priority, setPriority] = useState(0);
    const [offerId, setOfferId] = useState<number | "">("");

    // Theme State
    const [theme, setTheme] = useState({
        primary_color: "#000000",
        secondary_color: "#666666",
        accent_color: "#f3f4f6",
        background_color: "#ffffff",
        surface_color: "#ffffff",
        text_color: "#000000",
        border_color: "#e5e7eb",
        border_radius: "0.5rem"
    });

    // Banners State
    const [banners, setBanners] = useState([{
        placement: "HOME_HERO",
        title: "",
        subtitle: "",
        cta_text: "",
        cta_link: "",
        text_position: "CENTER",
        use_overlay: true,
        desktop_image: "",
        mobile_image: "",
        desktop_image_url: "",
        mobile_image_url: ""
    }]);

    // Decorations State
    const [useMarquee, setUseMarquee] = useState(false);
    const [useSparkles, setUseSparkles] = useState(false);

    useEffect(() => {
        // Generate slug from name
        setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }, [name]);

    useEffect(() => {
        // Fetch active/available offers to link
        fetch("http://localhost:8000/api/v1/offers/offers/")
            .then(res => res.json())
            .then(data => setOffers(data.results || data))
            .catch(console.error);
    }, []);

    const handleThemeChange = (key: string, value: string) => {
        setTheme(prev => ({ ...prev, [key]: value }));
    };

    const applyPreset = (presetName: string) => {
        if (presetName === 'diwali') {
            setTheme({
                primary_color: "#D4AF37",
                secondary_color: "#8B0000",
                accent_color: "#FFD700",
                background_color: "#FFFDF5",
                surface_color: "#ffffff",
                text_color: "#333333",
                border_color: "#e5e7eb",
                border_radius: "0.5rem"
            });
        } else if (presetName === 'midnight') {
            setTheme({
                primary_color: "#3b82f6",
                secondary_color: "#1e3a8a",
                accent_color: "#60a5fa",
                background_color: "#0f172a",
                surface_color: "#1e293b",
                text_color: "#f8fafc",
                border_color: "#334155",
                border_radius: "1rem"
            });
        }
    };

    const handleImageUpload = async (file: File, type: 'desktop' | 'mobile') => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await fetch("http://localhost:8000/api/v1/campaigns/upload_image/", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                const b = [...banners];
                if (type === 'desktop') {
                    b[0].desktop_image = data.id;
                    b[0].desktop_image_url = data.url;
                }
                if (type === 'mobile') {
                    b[0].mobile_image = data.id;
                    b[0].mobile_image_url = data.url;
                }
                setBanners(b);
            } else {
                alert("Failed to upload image.");
            }
        } catch (error) {
            console.error("Image upload failed", error);
            alert("Failed to upload image.");
        }
    };

    const submitCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const activeDecorations = [];
        if (useMarquee) activeDecorations.push({ placement: 'GLOBAL', animation: 'MARQUEE', opacity: 1.0 });
        if (useSparkles) activeDecorations.push({ placement: 'GLOBAL', animation: 'SPARKLES', opacity: 1.0 });

        const payload = {
            name,
            slug,
            description,
            start_date: startDate ? new Date(startDate).toISOString() : null,
            end_date: endDate ? new Date(endDate).toISOString() : null,
            priority,
            status,
            offer: offerId ? { id: offerId } : null,
            theme,
            banners: banners.filter(b => b.title).map(b => {
                const { desktop_image_url, mobile_image_url, ...rest } = b;
                return {
                    ...rest,
                    desktop_image: rest.desktop_image || null,
                    mobile_image: rest.mobile_image || null
                };
            }),
            decorations: activeDecorations
        };

        try {
            const res = await fetch("http://localhost:8000/api/v1/campaigns/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push("/hq-panel/campaigns");
            } else {
                const err = await res.json();
                alert("Failed to create campaign: " + JSON.stringify(err));
            }
        } catch (error) {
            console.error(error);
        }
        setSubmitting(false);
    };

    return (
        <form onSubmit={submitCampaign} className="p-8 max-w-5xl mx-auto pb-24">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/hq-panel/campaigns" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
                </div>
                <button type="submit" disabled={submitting} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50">
                    <Save size={18} />
                    {submitting ? 'Saving...' : 'Save & Activate'}
                </button>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Campaign Details</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="e.g. Summer Sale 2026" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                <input type="text" value={slug} readOnly className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 text-gray-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" rows={2} placeholder="Optional description..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm">
                                        <option value="DRAFT">Draft</option>
                                        <option value="SCHEDULED">Scheduled</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="DISABLED">Disabled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <input type="number" value={priority} onChange={e => setPriority(parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-md text-sm" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link to Offer (Optional)</label>
                                <select value={offerId} onChange={e => setOfferId(parseInt(e.target.value) || "")} className="w-full px-3 py-2 border rounded-md text-sm">
                                    <option value="">-- No Offer --</option>
                                    {offers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visual Builder */}
                <div className="col-span-2 space-y-6">
                    {/* Theme Editor */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h2 className="text-lg font-semibold">Visual Theme Editor</h2>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => applyPreset('diwali')} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Diwali Preset</button>
                                <button type="button" onClick={() => applyPreset('midnight')} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Midnight Cyber</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {Object.entries(theme).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 capitalize">{key.replace('_', ' ')}</p>
                                        {key === 'border_radius' ? (
                                            <input type="text" value={value} onChange={(e) => handleThemeChange(key, e.target.value)} className="w-20 text-xs border border-gray-300 rounded p-1 mt-1" />
                                        ) : (
                                            <input type="text" value={value} onChange={(e) => handleThemeChange(key, e.target.value)} className="w-20 text-xs border border-gray-300 rounded p-1 mt-1 uppercase" placeholder="#000000" />
                                        )}
                                    </div>
                                    {key !== 'border_radius' && (
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={value} onChange={(e) => handleThemeChange(key, e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Banner Builder */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Primary Banner (Hero)</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
                                <input type="text" value={banners[0].title} onChange={e => {const b = [...banners]; b[0].title = e.target.value; setBanners(b)}} className="w-full px-3 py-2 border rounded-md text-sm font-bold text-lg" placeholder="Grand Festive Sale" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                    <input type="text" value={banners[0].subtitle} onChange={e => {const b = [...banners]; b[0].subtitle = e.target.value; setBanners(b)}} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="Celebrate & Save" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Alignment</label>
                                    <select value={banners[0].text_position} onChange={e => {const b = [...banners]; b[0].text_position = e.target.value; setBanners(b)}} className="w-full px-3 py-2 border rounded-md text-sm">
                                        <option value="LEFT">Left Align</option>
                                        <option value="CENTER">Center</option>
                                        <option value="RIGHT">Right Align</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                                    <input type="text" value={banners[0].cta_text} onChange={e => {const b = [...banners]; b[0].cta_text = e.target.value; setBanners(b)}} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="Shop Now" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                                    <input type="text" value={banners[0].cta_link} onChange={e => {const b = [...banners]; b[0].cta_link = e.target.value; setBanners(b)}} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="/products" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Desktop Image</label>
                                    <input type="file" accept="image/*" onChange={e => {
                                        if (e.target.files?.[0]) handleImageUpload(e.target.files[0], 'desktop');
                                    }} className="w-full px-3 py-2 border rounded-md text-sm" />
                                    {banners[0].desktop_image && <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Image</label>
                                    <input type="file" accept="image/*" onChange={e => {
                                        if (e.target.files?.[0]) handleImageUpload(e.target.files[0], 'mobile');
                                    }} className="w-full px-3 py-2 border rounded-md text-sm" />
                                    {banners[0].mobile_image && <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>}
                                </div>
                            </div>
                            
                            <label className="flex items-center gap-2 mt-2">
                                <input type="checkbox" checked={banners[0].use_overlay} onChange={e => {const b = [...banners]; b[0].use_overlay = e.target.checked; setBanners(b)}} className="rounded border-gray-300 text-black focus:ring-black" />
                                <span className="text-sm font-medium text-gray-700">Use Dark Overlay (makes text readable over images)</span>
                            </label>

                            <div className="p-4 mt-6 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-semibold mb-2 text-gray-600 uppercase tracking-widest">Live Preview</h3>
                                <div className="relative w-full h-48 rounded-lg overflow-hidden flex items-center shadow-inner" style={{ backgroundColor: theme.background_color, justifyContent: banners[0].text_position === 'LEFT' ? 'flex-start' : banners[0].text_position === 'RIGHT' ? 'flex-end' : 'center' }}>
                                    
                                    {banners[0].desktop_image_url && (
                                        <img src={`http://localhost:8000${banners[0].desktop_image_url}`} className="absolute inset-0 w-full h-full object-cover" alt="Banner background" />
                                    )}

                                    <div className="relative z-10 px-8 text-center w-full" style={{ textAlign: banners[0].text_position === 'LEFT' ? 'left' : banners[0].text_position === 'RIGHT' ? 'right' : 'center' }}>
                                        <p style={{ color: theme.accent_color }} className="text-xs uppercase font-bold tracking-widest mb-1 drop-shadow-md">{banners[0].subtitle || 'Subtitle'}</p>
                                        <h2 style={{ color: theme.surface_color }} className="text-3xl font-black mb-3 drop-shadow-lg">{banners[0].title || 'Banner Title'}</h2>
                                        {banners[0].cta_text && (
                                            <span style={{ backgroundColor: theme.primary_color, color: theme.surface_color, borderRadius: theme.border_radius }} className="px-4 py-2 text-xs font-bold uppercase tracking-wider inline-block">
                                                {banners[0].cta_text}
                                            </span>
                                        )}
                                    </div>
                                    {banners[0].use_overlay && <div className="absolute inset-0 bg-black/40"></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorations & Animations */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Festival Effects & Animations</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="checkbox" checked={useMarquee} onChange={e => setUseMarquee(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
                                <div>
                                    <p className="font-semibold text-sm">Scrolling Marquee (Ticker)</p>
                                    <p className="text-xs text-gray-500">Adds an urgent, scrolling ticker banner at the top.</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="checkbox" checked={useSparkles} onChange={e => setUseSparkles(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
                                <div>
                                    <p className="font-semibold text-sm">Floating Sparkles</p>
                                    <p className="text-xs text-gray-500">Adds ambient, animated festival sparkles across the site.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
