"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateOfferPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        offer_type: 'PERCENTAGE',
        discount_value: '',
        start_date: '',
        end_date: '',
        priority: 10,
        min_profit_amount: '',
        min_margin_percent: '15'
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/api/v1/offers/offers/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/hq-panel/offers/${data.id}/products`);
            } else {
                const err = await res.json();
                alert(JSON.stringify(err));
            }
        } catch (error) {
            console.error(error);
            alert('Failed to create offer');
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/hq-panel/offers" className="text-gray-500 hover:text-black">
                    &larr; Back
                </Link>
                <h1 className="text-3xl font-bold">Create Smart Offer</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" placeholder="e.g. Launch Sale" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                    <select name="offer_type" value={formData.offer_type} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                        <option value="PERCENTAGE">Percentage Discount (%)</option>
                        <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                    <input required type="number" step="0.01" name="discount_value" value={formData.discount_value} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" placeholder="e.g. 20" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="datetime-local" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="datetime-local" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                    <h3 className="font-semibold text-blue-900">Smart Profit Rules</h3>
                    <p className="text-sm text-blue-700">These rules ensure your offer doesn't sell products at a loss.</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Profit Margin (%)</label>
                            <input type="number" step="0.01" name="min_margin_percent" value={formData.min_margin_percent} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" placeholder="e.g. 15" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Profit Amount (₹)</label>
                            <input type="number" step="0.01" name="min_profit_amount" value={formData.min_profit_amount} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" placeholder="e.g. 100" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create & Select Products'}
                    </button>
                </div>
            </form>
        </div>
    );
}
