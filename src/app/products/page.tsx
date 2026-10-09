import Link from 'next/link';
import { Product } from '@/types/catalog';
import { HorizontalScroller } from "@/components/smart/HorizontalScroller";
import { ProductCardCinematic } from "@/components/smart/ProductCardCinematic";
import { SlidersHorizontalIcon as SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterSidebar } from '@/components/smart/FilterSidebar';

import { MOCK_PRODUCTS } from '@/lib/mockData';

async function getProducts(searchParams?: { [key: string]: string | string[] | undefined }): Promise<Product[]> {
  try {
    let filtered = [...MOCK_PRODUCTS];
    if (searchParams) {
      const category = searchParams.category as string;
      const brand = searchParams.brand as string;
      const color = searchParams.color as string;
      const size = searchParams.size as string;

      if (category) filtered = filtered.filter(p => p.category?.slug === category);
      if (brand) filtered = filtered.filter(p => p.brand?.slug === brand);
      if (color) filtered = filtered.filter(p => p.variants.some((v: any) => v.color_name === color));
      if (size) filtered = filtered.filter(p => p.variants.some((v: any) => v.size_name === size));
    }
    return filtered;
  } catch {
    return [];
  }
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);

  return (
    <div className="bg-background min-h-screen pb-32">
      
      {/* Directory Header (Bento Style) */}
      <section className="px-4 md:px-8 mb-12">
        <div className="bg-secondary rounded-[2rem] md:rounded-[4rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 shadow-inner">
            <div>
                <h1 className="font-heading text-6xl md:text-8xl tracking-tight mb-2">Directory</h1>
                <p className="uppercase tracking-[0.3em] text-xs font-bold text-muted-foreground">
                    {products.length} Items Available
                </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <Button variant="outline" size="sm" className="rounded-full w-full md:w-auto flex items-center justify-center gap-2 px-6 text-xs font-bold tracking-wider border-border cursor-pointer bg-background hover:bg-background shadow-sm lg:hidden">
                    <SlidersHorizontal className="w-4 h-4" /> FILTERS
                </Button>
            </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-8 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar pr-4">
            <FilterSidebar />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] bg-secondary rounded-[3rem] w-full">
                <h2 className="font-heading text-4xl mb-4">No products found.</h2>
                <p className="text-muted-foreground text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                {products.map((product, i) => (
                    <div 
                        key={product.id} 
                        className={`w-full overflow-hidden shadow-xl border border-border/10 ${i % 3 === 0 ? 'rounded-[3rem] rounded-tr-[1rem]' : i % 2 === 0 ? 'rounded-[3rem] rounded-bl-[1rem]' : 'rounded-[3rem]'}`}
                    >
                        <ProductCardCinematic product={product} />
                    </div>
                ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
