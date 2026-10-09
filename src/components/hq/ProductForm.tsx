"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2, Image as ImageIcon, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);

  // Form State
  const [productData, setProductData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    brand: initialData?.brand || '',
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
  });

  const [metadataStr, setMetadataStr] = useState(
    initialData?.metadata ? JSON.stringify(initialData.metadata, null, 2) : '{\n  \n}'
  );

  const [variants, setVariants] = useState<any[]>(initialData?.variants || []);
  const [productMedia, setProductMedia] = useState<any[]>(initialData?.media || []);
  const [pendingMedia, setPendingMedia] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchDeps = async () => {
      try {
        const [catRes, brandRes, colorRes, sizeRes] = await Promise.all([
          api.get('/catalog/categories/'),
          api.get('/catalog/brands/'),
          api.get('/catalog/colors/'),
          api.get('/catalog/sizes/')
        ]);
        setCategories(catRes.data.results || catRes.data);
        setBrands(brandRes.data.results || brandRes.data);
        setColors(colorRes.data.results || colorRes.data);
        setSizes(sizeRes.data.results || sizeRes.data);
      } catch (e) {
        console.error("Failed to fetch dependencies", e);
      }
    };
    fetchDeps();
  }, []);

  const handleProductChange = (field: string, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
    setVariants([...variants, {
      sku: '',
      color: '',
      size: '',
      upc: '',
      weight: 0,
      base_cost: 0,
      msrp: 0,
      selling_price: 0,
      stock_quantity: 0,
      low_stock_threshold: 5,
      track_inventory: true,
      allow_backorder: false,
      is_active: true
    }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('original_file', file);
    formData.append('mime_type', file.type);
    formData.append('file_size', file.size.toString());
    formData.append('source', 'INTERNAL');

    setUploading(true);
    try {
      const res = await api.post('/media/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const mediaId = res.data.id;
      
      if (isEdit && initialData?.slug) {
         const addRes = await api.post(`/catalog/products/${initialData.slug}/add-media/`, { 
            media_file_id: mediaId, 
            is_primary: productMedia.length === 0 
         });
         // Refetch product to get updated media
         const prodRes = await api.get(`/catalog/products/${initialData.slug}/`);
         setProductMedia(prodRes.data.media);
      } else {
         setPendingMedia([...pendingMedia, {
            id: 'pending-' + Date.now(),
            media_file: mediaId,
            original_url: URL.createObjectURL(file), // temp preview
            is_primary: pendingMedia.length === 0
         }]);
      }
    } catch (err) {
      console.error('Failed to upload image', err);
      alert('Failed to upload image. Please check media service.');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = ''; // reset input
    }
  };

  const removeMedia = async (mediaId: string, isPending: boolean) => {
    if (isPending) {
        setPendingMedia(pendingMedia.filter(m => m.id !== mediaId));
    } else {
        if (!confirm('Remove this image?')) return;
        try {
            await api.post(`/catalog/products/${initialData.slug}/remove-media/`, { media_id: mediaId });
            setProductMedia(productMedia.filter(m => m.id !== mediaId));
        } catch (err) {
            console.error('Failed to remove media', err);
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let parsedMetadata = {};
      try {
        parsedMetadata = JSON.parse(metadataStr);
      } catch (e) {
        alert("Invalid JSON in Metadata field.");
        setLoading(false);
        return;
      }

      const payload = { ...productData, metadata: parsedMetadata };
      let productRes;
      let slug = initialData?.slug;

      if (isEdit && slug) {
        productRes = await api.put(`/catalog/products/${slug}/`, payload);
      } else {
        productRes = await api.post('/catalog/products/', payload);
        slug = productRes.data.slug;
      }

      const productId = productRes.data.id;

      // Create variants
      for (const variant of variants) {
        if (variant.id) {
           await api.put(`/catalog/variants/${variant.id}/`, { ...variant, product: productId });
        } else {
           await api.post('/catalog/variants/', { ...variant, product: productId });
        }
      }

      // If new product, attach pending media
      if (!isEdit && slug && pendingMedia.length > 0) {
          for (const pm of pendingMedia) {
             await api.post(`/catalog/products/${slug}/add-media/`, {
                media_file_id: pm.media_file,
                is_primary: pm.is_primary
             });
          }
      }

      router.push('/hq-panel/products');
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save product. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob')) return url;
    const backendHost = api.defaults.baseURL?.split('/api')[0] || 'http://localhost:8000';
    return `${backendHost}${url}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/hq-panel/products" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-black">{isEdit ? 'Edit Product' : 'Create Product'}</h1>
            <p className="text-muted-foreground text-sm mt-1">{isEdit ? 'Update product details and variations' : 'Add a new product to your catalog'}</p>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
          {isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Info */}
          <div className="bg-background rounded-3xl shadow-sm border border-border/60 p-8">
            <h2 className="text-xl font-bold font-heading mb-6">General Information</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Product Name <span className="text-destructive">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={productData.name}
                    onChange={e => handleProductChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-xl focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="e.g. Eco Friendly Water Bottle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Slug <span className="text-destructive">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={productData.slug}
                    onChange={e => handleProductChange('slug', e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-xl focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="eco-friendly-water-bottle"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea 
                  rows={6}
                  value={productData.description}
                  onChange={e => handleProductChange('description', e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-xl focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y min-h-[120px]"
                  placeholder="Detailed description of the product..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Metadata (JSON)</label>
                <textarea 
                  rows={4}
                  value={metadataStr}
                  onChange={e => setMetadataStr(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-xl focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y font-mono text-sm"
                  placeholder='{"material": "cotton", "care": "machine wash"}'
                />
                <p className="text-xs text-muted-foreground mt-1.5">Flexible attributes that aren't used for filtering often.</p>
              </div>
            </div>
          </div>

          {/* Variants Builder */}
          <div className="bg-background rounded-3xl shadow-sm border border-border/60 p-8 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold font-heading">Product Variants</h2>
                <p className="text-sm text-muted-foreground mt-1">Add variations like colors and sizes with specific pricing.</p>
              </div>
              <button 
                type="button" 
                onClick={addVariant}
                className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-bold hover:bg-secondary/80 transition-colors whitespace-nowrap"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>
            
            <div className="space-y-6">
              {variants.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-border/50 rounded-2xl bg-secondary/20">
                  <p className="text-muted-foreground font-medium">No variants added yet. Click 'Add Variant' to create one.</p>
                </div>
              ) : (
                variants.map((variant, index) => (
                  <div key={index} className="p-6 border border-border/50 rounded-2xl relative group bg-secondary/10">
                    <button 
                      type="button" 
                      onClick={() => removeVariant(index)}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">SKU <span className="text-destructive">*</span></label>
                        <input required type="text" value={variant.sku || ''} onChange={e => handleVariantChange(index, 'sku', e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border/50 rounded-lg focus:border-primary outline-none shadow-sm" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">UPC</label>
                        <input type="text" value={variant.upc || ''} onChange={e => handleVariantChange(index, 'upc', e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border/50 rounded-lg focus:border-primary outline-none shadow-sm" placeholder="Optional" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Color</label>
                        <select value={variant.color || ''} onChange={e => handleVariantChange(index, 'color', e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border/50 rounded-lg focus:border-primary outline-none shadow-sm">
                          <option value="">Select Color</option>
                          {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Size</label>
                        <select value={variant.size || ''} onChange={e => handleVariantChange(index, 'size', e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border/50 rounded-lg focus:border-primary outline-none shadow-sm">
                          <option value="">Select Size</option>
                          {sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Weight (kg)</label>
                        <input type="number" step="0.01" value={variant.weight ?? ''} onChange={e => handleVariantChange(index, 'weight', e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border/50 rounded-lg focus:border-primary outline-none shadow-sm" />
                      </div>
                      <div className="hidden md:block"></div> {/* Spacer */}
                      
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Base Cost</label>
                        <input type="number" step="0.01" value={variant.base_cost ?? ''} onChange={e => handleVariantChange(index, 'base_cost', e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border/50 rounded-lg focus:border-primary outline-none shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">MSRP</label>
                        <input type="number" step="0.01" value={variant.msrp ?? ''} onChange={e => handleVariantChange(index, 'msrp', e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border/50 rounded-lg focus:border-primary outline-none shadow-sm" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-primary mb-1.5">Selling Price <span className="text-destructive">*</span></label>
                        <input required type="number" step="0.01" value={variant.selling_price ?? ''} onChange={e => handleVariantChange(index, 'selling_price', e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border/50 rounded-lg focus:border-primary outline-none shadow-sm font-bold text-primary" />
                      </div>

                      <div className="col-span-full border-t border-border/50 my-2 pt-2"></div>
                      
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Stock Quantity ⭐</label>
                        <input type="number" value={variant.stock_quantity ?? ''} onChange={e => handleVariantChange(index, 'stock_quantity', parseInt(e.target.value))} className="w-full px-3 py-2 text-sm bg-background border border-border/50 rounded-lg focus:border-primary outline-none shadow-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Low Stock Threshold</label>
                        <input type="number" value={variant.low_stock_threshold ?? ''} onChange={e => handleVariantChange(index, 'low_stock_threshold', parseInt(e.target.value))} className="w-full px-3 py-2 text-sm bg-background border border-border/50 rounded-lg focus:border-primary outline-none shadow-sm" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={variant.track_inventory ?? true} onChange={e => handleVariantChange(index, 'track_inventory', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                          <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">Track Inventory</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={variant.allow_backorder ?? false} onChange={e => handleVariantChange(index, 'allow_backorder', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                          <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">Allow Backorder</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <div className="bg-background rounded-3xl shadow-sm border border-border/60 p-8">
            <h2 className="text-xl font-bold font-heading mb-6">Organization</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Status</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => handleProductChange('is_active', true)} className={`flex-1 py-2.5 rounded-xl font-bold text-sm border transition-colors ${productData.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-inner' : 'bg-transparent border-border/50 text-muted-foreground hover:bg-secondary'}`}>Active</button>
                  <button type="button" onClick={() => handleProductChange('is_active', false)} className={`flex-1 py-2.5 rounded-xl font-bold text-sm border transition-colors ${!productData.is_active ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-inner' : 'bg-transparent border-border/50 text-muted-foreground hover:bg-secondary'}`}>Draft</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Featured</label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-border/50 rounded-xl hover:bg-secondary/50 transition-colors">
                  <input type="checkbox" checked={productData.is_featured} onChange={e => handleProductChange('is_featured', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <div>
                    <span className="text-sm font-bold block">Featured Product</span>
                    <span className="text-xs text-muted-foreground block">Highlight this product on the storefront</span>
                  </div>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Category <span className="text-destructive">*</span></label>
                <select 
                  required
                  value={productData.category}
                  onChange={e => handleProductChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-xl focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Brand</label>
                <select 
                  value={productData.brand || ''}
                  onChange={e => handleProductChange('brand', e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-xl focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                >
                  <option value="">Select a brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-3xl shadow-sm border border-border/60 p-8">
            <h2 className="text-xl font-bold font-heading mb-6">Media Gallery</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                {[...productMedia, ...pendingMedia].map((m) => (
                    <div key={m.id} className="relative aspect-square rounded-xl border border-border/50 overflow-hidden group bg-secondary">
                        <img src={getImageUrl(m.webp_url || m.original_url)} alt="Product" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                type="button" 
                                onClick={() => removeMedia(m.id, !!m.media_file)}
                                className="w-8 h-8 rounded-full bg-destructive/90 text-white flex items-center justify-center hover:bg-destructive transform scale-90 group-hover:scale-100 transition-all shadow-lg"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        {m.is_primary && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">
                                Primary
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <label className="border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group">
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              <div className="w-12 h-12 bg-secondary text-muted-foreground group-hover:text-primary rounded-full flex items-center justify-center mb-3 transition-colors">
                {uploading ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <UploadCloud size={20} />
                )}
              </div>
              <p className="font-bold text-sm text-foreground">{uploading ? 'Uploading...' : 'Upload Image'}</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP up to 5MB</p>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
