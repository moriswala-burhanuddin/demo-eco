"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit3, Trash2, Power } from "lucide-react";

interface Campaign {
    id: number;
    name: string;
    slug: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    priority: number;
}

export default function CampaignsList() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/v1/campaigns/");
            if (res.ok) {
                const data = await res.json();
                // DRF might return paginated results
                setCampaigns(data.results || data);
            }
        } catch (error) {
            console.error("Failed to fetch campaigns", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const toggleStatus = async (campaign: Campaign) => {
        const newStatus = campaign.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
        try {
            const res = await fetch(`http://localhost:8000/api/v1/campaigns/${campaign.id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchCampaigns();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campaign Engine</h1>
                    <p className="text-gray-500 mt-1">Manage global visual themes and site-wide banners.</p>
                </div>
                <Link href="/hq-panel/campaigns/create" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
                    <Plus size={16} />
                    New Campaign
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Dates</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading campaigns...</td></tr>
                        ) : campaigns.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No campaigns found.</td></tr>
                        ) : (
                            campaigns.map(camp => (
                                <tr key={camp.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{camp.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            camp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                            camp.status === 'DISABLED' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {camp.start_date ? new Date(camp.start_date).toLocaleDateString() : 'N/A'} 
                                        {' - '}
                                        {camp.end_date ? new Date(camp.end_date).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{camp.priority}</td>
                                    <td className="px-6 py-4 flex justify-end gap-3">
                                        <button onClick={() => toggleStatus(camp)} className={`p-2 rounded-lg transition-colors ${camp.status === 'ACTIVE' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100 hover:text-black'}`} title={camp.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>
                                            <Power size={18} />
                                        </button>
                                        <Link href={`/hq-panel/campaigns/${camp.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit3 size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
