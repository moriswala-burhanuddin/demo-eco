"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OffersPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/v1/offers/')
            .then(res => res.json())
            .then(data => {
                setOffers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8">Loading offers...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Offers & Promotions</h1>
                <Link href="/admin/offers/create" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                    Create Offer
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Offer Name</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500">Type</th>
                            <th className="p-4 font-medium text-gray-500">Value</th>
                            <th className="p-4 font-medium text-gray-500">Products</th>
                            <th className="p-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {offers.map(offer => (
                            <tr key={offer.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{offer.name}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        offer.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                        offer.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                                        offer.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {offer.status}
                                    </span>
                                </td>
                                <td className="p-4">{offer.offer_type}</td>
                                <td className="p-4">{offer.discount_value}</td>
                                <td className="p-4">{offer.offer_products_count || 0}</td>
                                <td className="p-4">
                                    <Link href={`/admin/offers/${offer.id}/products`} className="text-blue-600 hover:underline">
                                        Manage Products
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {offers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No offers found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
