"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';

export default function OfferProductsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const [offer, setOffer] = useState<any>(null);
    const [preview, setPreview] = useState<any>(null);
    
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const query = new URLSearchParams();
        if (category) query.append('category', category);
        if (search) query.append('search', search);
        
        fetch(`http://localhost:8000/api/v1/catalog/products/?${query.toString()}`)
            .then(res => res.json())
            .then(data => setProducts(data.results || data));
    }, [category, search]);

    useEffect(() => {
        fetch(`http://localhost:8000/api/v1/offers/offers/${id}/`)
            .then(res => res.json())
            .then(data => setOffer(data));
            
        fetch(`http://localhost:8000/api/v1/catalog/categories/`)
            .then(res => res.json())
            .then(data => setCategories(data.results || data));
            
        fetchPreview();
    }, [id]);

    const fetchPreview = async () => {
        const res = await fetch(`http://localhost:8000/api/v1/offers/offers/${id}/preview/`);
        const data = await res.json();
        setPreview(data);
    };

    const handleBulkAdd = async () => {
        if (selectedIds.size === 0) return;
        
        await fetch(`http://localhost:8000/api/v1/offers/offers/${id}/bulk-products/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_ids: Array.from(selectedIds) })
        });
        
        setSelectedIds(new Set());
        fetchPreview();
    };

    const handleActivate = async () => {
        await fetch(`http://localhost:8000/api/v1/offers/offers/${id}/activate/`, { method: 'POST' });
        router.push('/hq-panel/offers');
    };

    if (!offer || !preview) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/hq-panel/offers" className="text-gray-500 hover:text-black">&larr; Back</Link>
                    <h1 className="text-3xl font-bold">{offer.name} - Products</h1>
                </div>
                
                <div className="flex gap-4">
                    <button onClick={handleActivate} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition font-medium">
                        Activate Offer
                    </button>
                </div>
            </div>

            {/* Add Products Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Select Products to Add</h2>
                <div className="flex gap-4 items-end mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" placeholder="Search products..." />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-md p-2">
                            <option value="">All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleBulkAdd} disabled={selectedIds.size === 0} className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50">
                        Add Selected ({selectedIds.size})
                    </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                            <tr>
                                <th className="p-3 w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedIds(new Set(products.map(p => p.id)));
                                            else setSelectedIds(new Set());
                                        }}
                                        checked={products.length > 0 && selectedIds.size === products.length}
                                    />
                                </th>
                                <th className="p-3 font-medium text-gray-600">Product Name</th>
                                <th className="p-3 font-medium text-gray-600">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="p-3 text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.has(p.id)}
                                            onChange={(e) => {
                                                const newSet = new Set(selectedIds);
                                                if (e.target.checked) newSet.add(p.id);
                                                else newSet.delete(p.id);
                                                setSelectedIds(newSet);
                                            }}
                                        />
                                    </td>
                                    <td className="p-3">{p.name}</td>
                                    <td className="p-3">₹{p.variants?.[0]?.selling_price || 0}</td>
                                </tr>
                            ))}
                            {products.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-gray-500">No products found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Offer Preview & Profitability</h2>
                    <div className="flex gap-4 text-sm font-medium">
                        <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full">Safe: {preview.profitable_count}</span>
                        <span className="text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">Low Margin: {preview.low_margin_count}</span>
                        <span className="text-red-700 bg-red-100 px-3 py-1 rounded-full">Loss/Blocked: {preview.loss_count}</span>
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Product</th>
                            <th className="p-4 font-medium text-gray-500">Cost</th>
                            <th className="p-4 font-medium text-gray-500">Original Price</th>
                            <th className="p-4 font-medium text-gray-500 text-blue-600">Offer Price</th>
                            <th className="p-4 font-medium text-gray-500">Profit</th>
                            <th className="p-4 font-medium text-gray-500">Margin</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {preview.loss.map((p: any) => <PreviewRow key={p.product_id} item={p} status="LOSS" />)}
                        {preview.low_margin.map((p: any) => <PreviewRow key={p.product_id} item={p} status="LOW_MARGIN" />)}
                        {preview.profitable.map((p: any) => <PreviewRow key={p.product_id} item={p} status="SAFE" />)}
                        
                        {(preview.profitable_count + preview.low_margin_count + preview.loss_count) === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">
                                    No products added to this offer yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PreviewRow({ item, status }: { item: any, status: string }) {
    return (
        <tr className="hover:bg-gray-50">
            <td className="p-4 font-medium">{item.name}</td>
            <td className="p-4">₹{item.cost}</td>
            <td className="p-4 text-gray-500 line-through">₹{item.selling_price}</td>
            <td className="p-4 font-bold text-blue-600">₹{item.offer_price}</td>
            <td className={`p-4 font-medium ${item.profit < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{Number(item.profit).toFixed(2)}
            </td>
            <td className="p-4">{Number(item.margin).toFixed(1)}%</td>
            <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                    status === 'SAFE' ? 'bg-green-100 text-green-700' :
                    status === 'LOW_MARGIN' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                }`}>
                    {status === 'SAFE' ? '🟢 SAFE' : status === 'LOW_MARGIN' ? '🟡 LOW MARGIN' : '🔴 LOSS'}
                </span>
            </td>
        </tr>
    );
}
