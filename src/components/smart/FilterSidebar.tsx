"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import api from "@/services/api";

type Category = { id: number; name: string; slug: string; parent: number | null; get_absolute_url: string };
type Brand = { id: number; name: string; slug: string };
type Color = { id: number; name: string; hex_code: string };
type Size = { id: number; name: string; sort_order: number };

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    brand: true,
    color: true,
    size: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, brs, cols, szs] = await Promise.all([
          api.get("/catalog/categories/"),
          api.get("/catalog/brands/"),
          api.get("/catalog/colors/"),
          api.get("/catalog/sizes/"),
        ]);
        setCategories(cats.data.results || cats.data);
        setBrands(brs.data.results || brs.data);
        setColors(cols.data.results || cols.data);
        setSizes(szs.data.results || szs.data);
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };
    fetchData();
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      current.set(key, value);
    } else {
      current.delete(key);
    }
    router.push(`/products?${current.toString()}`);
  };

  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentColor = searchParams.get("color") || "";
  const currentSize = searchParams.get("size") || "";
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl uppercase tracking-widest">Filters</h3>
        <button 
            className="text-xs text-muted-foreground uppercase tracking-widest hover:text-foreground font-bold cursor-pointer"
            onClick={() => router.push("/products")}
        >
            Clear All
        </button>
      </div>

      <div className="space-y-4">
        {/* Categories */}
        <div className="border-b border-border/50 pb-4">
          <button onClick={() => toggleSection("category")} className="flex items-center justify-between w-full uppercase tracking-widest text-sm font-bold cursor-pointer mb-4">
            Category {openSections.category ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
          </button>
          {openSections.category && (
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pl-1">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category"
                    checked={currentCategory === c.slug}
                    onChange={() => updateFilter("category", c.slug)}
                    className="accent-primary w-4 h-4"
                  />
                  <span className={`text-sm ${currentCategory === c.slug ? 'font-bold text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {c.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="border-b border-border/50 pb-4">
          <button onClick={() => toggleSection("brand")} className="flex items-center justify-between w-full uppercase tracking-widest text-sm font-bold cursor-pointer mb-4">
            Brands {openSections.brand ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
          </button>
          {openSections.brand && (
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pl-1">
              {brands.map((b) => (
                <label key={b.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="brand"
                    checked={currentBrand === b.slug}
                    onChange={() => updateFilter("brand", b.slug)}
                    className="accent-primary w-4 h-4"
                  />
                  <span className={`text-sm ${currentBrand === b.slug ? 'font-bold text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {b.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="border-b border-border/50 pb-4">
          <button onClick={() => toggleSection("color")} className="flex items-center justify-between w-full uppercase tracking-widest text-sm font-bold cursor-pointer mb-4">
            Colors {openSections.color ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
          </button>
          {openSections.color && (
            <div className="flex flex-wrap gap-3 pl-1">
              {colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateFilter("color", currentColor === c.name ? "" : c.name)}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${currentColor === c.name ? 'border-primary scale-110' : 'border-transparent hover:scale-110 shadow-sm'}`}
                  style={{ backgroundColor: c.hex_code || '#cccccc' }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="border-b border-border/50 pb-4">
          <button onClick={() => toggleSection("size")} className="flex items-center justify-between w-full uppercase tracking-widest text-sm font-bold cursor-pointer mb-4">
            Sizes {openSections.size ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
          </button>
          {openSections.size && (
            <div className="flex flex-wrap gap-2 pl-1">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => updateFilter("size", currentSize === s.name ? "" : s.name)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border cursor-pointer transition-all ${currentSize === s.name ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="pb-4">
          <button onClick={() => toggleSection("price")} className="flex items-center justify-between w-full uppercase tracking-widest text-sm font-bold cursor-pointer mb-4">
            Price {openSections.price ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
          </button>
          {openSections.price && (
            <div className="flex items-center gap-2 pl-1">
              <div className="flex-1">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => updateFilter("min_price", e.target.value)}
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="flex-1">
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => updateFilter("max_price", e.target.value)}
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
