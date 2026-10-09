"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, MoreVertical, Edit, Copy, Trash2, Check, X, Filter, Image as ImageIcon, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';
import { formatCurrency } from '@/lib/currency';

interface Product {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  category: number;
  brand: number | null;
  best_offer_price: number | null;
  media: any[];
  variants: any[];
}

export function ProductsTable() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/catalog/products/?page=${page}&search=${search}`);
      setProducts(res.data.results || res.data);
      if (res.data.count) {
        setTotalPages(Math.ceil(res.data.count / 10)); 
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length && products.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    try {
      await api.post('/catalog/products/bulk-delete/', { ids: selectedIds });
      setSelectedIds([]);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete products', error);
    }
  };

  const handleBulkStatus = async (isActive: boolean) => {
    try {
      await api.post('/catalog/products/bulk-update-status/', { ids: selectedIds, is_active: isActive });
      setSelectedIds([]);
      fetchProducts();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleClone = async (slug: string) => {
    try {
      await api.post(`/catalog/products/${slug}/clone/`);
      fetchProducts();
    } catch (error) {
      console.error('Failed to clone product', error);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const backendHost = api.defaults.baseURL?.split('/api')[0] || 'http://localhost:8000';
    return `${backendHost}${url}`;
  };

  return (
    <div className="bg-background rounded-3xl shadow-sm border border-border/60 overflow-hidden relative flex flex-col w-full">
      {/* Header Actions */}
      <div className="p-4 sm:p-6 border-b border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary border border-border/50 rounded-xl text-sm font-bold hover:bg-secondary/80 hover:border-border transition-colors">
            <Filter size={16} /> <span className="hidden sm:inline">Filters</span>
          </button>
          <Link href="/hq-panel/products/new" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto relative min-h-[400px]">
        {loading && (
           <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-20">
             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}

        <table className="w-full text-left text-sm whitespace-nowrap min-w-[900px]">
          <thead className="bg-secondary/80 text-muted-foreground border-b border-border/50 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-4 w-14">
                <div className="flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={products.length > 0 && selectedIds.length === products.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded-md border-border text-primary focus:ring-primary/20 transition-colors cursor-pointer"
                  />
                </div>
              </th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[11px] text-foreground/70">Product</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[11px] text-foreground/70">Status</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[11px] text-foreground/70">Base Price</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[11px] text-foreground/70">Variants</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[11px] text-foreground/70 sticky right-0 bg-secondary/80 backdrop-blur-md z-10 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {products.length > 0 ? products.map(product => {
              const primaryMedia = product.media?.find(m => m.is_primary) || product.media?.[0];
              const imageUrl = primaryMedia ? getImageUrl(primaryMedia.webp_url || primaryMedia.original_url) : '';
              const isSelected = selectedIds.includes(product.id);
              
              return (
                <tr 
                  key={product.id} 
                  onClick={() => router.push(`/hq-panel/products/${product.slug}/edit`)}
                  className={`group transition-colors cursor-pointer ${isSelected ? 'bg-primary/[0.03]' : 'hover:bg-secondary/30'}`}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelect(product.id)}
                        className="w-4 h-4 rounded-md border-border text-primary focus:ring-primary/20 transition-colors cursor-pointer"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-secondary border border-border/60 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-muted-foreground/50" size={24} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm max-w-[280px] truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${product.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-secondary text-muted-foreground border-border/80'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-emerald-500' : 'bg-muted-foreground/60'}`}></span>
                      {product.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground text-sm">
                    {product.variants?.[0]?.selling_price ? formatCurrency(parseFloat(product.variants[0].selling_price)) : <span className="text-muted-foreground font-normal">No Price</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-secondary text-xs font-bold text-muted-foreground border border-border/50">
                      {product.variants?.length || 0}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right sticky right-0 transition-colors ${isSelected ? 'bg-primary/[0.03]' : 'bg-background group-hover:bg-secondary/30'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); router.push(`/hq-panel/products/${product.slug}/edit`); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleClone(product.slug); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                        title="Clone Product"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                         onClick={async (e) => { 
                             e.stopPropagation(); 
                             if (confirm('Delete this product?')) {
                                 try {
                                     await api.delete(`/catalog/products/${product.slug}/`);
                                     fetchProducts();
                                 } catch(err) { console.error(err); }
                             }
                         }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors focus:outline-none focus:ring-2 focus:ring-destructive/20"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Package className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-bold text-lg text-foreground">No products found</p>
                    <p className="text-sm mt-1">{loading ? 'Loading your catalog...' : 'Get started by creating your first product.'}</p>
                    {!loading && (
                      <Link href="/hq-panel/products/new" className="mt-4 flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-bold hover:bg-secondary/80 transition-colors">
                        <Plus size={16} /> Add Product
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-background">
           <span className="text-sm font-bold text-muted-foreground">
             Page <span className="text-foreground">{page}</span> of <span className="text-foreground">{totalPages}</span>
           </span>
           <div className="flex items-center gap-2">
             <button 
               disabled={page === 1} 
               onClick={() => setPage(p => Math.max(1, p - 1))}
               className="px-4 py-2 bg-secondary border border-border/50 rounded-xl text-sm font-bold hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
             >
               Previous
             </button>
             <button 
               disabled={page === totalPages}
               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
               className="px-4 py-2 bg-secondary border border-border/50 rounded-xl text-sm font-bold hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
             >
               Next
             </button>
           </div>
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border border-border/20"
          >
            <div className="font-bold whitespace-nowrap flex items-center">
              <span className="w-6 h-6 inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs mr-3 shadow-inner">{selectedIds.length}</span>
              Selected
            </div>
            <div className="h-6 w-px bg-background/20"></div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleBulkStatus(true)} className="px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                <Check size={16} /> Set Active
              </button>
              <button onClick={() => handleBulkStatus(false)} className="px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                <X size={16} /> Set Draft
              </button>
              <div className="h-4 w-px bg-background/20 mx-2"></div>
              <button onClick={handleBulkDelete} className="px-4 py-2 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center gap-2">
                <Trash2 size={16} /> Delete All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
