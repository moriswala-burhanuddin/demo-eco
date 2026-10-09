import { Metadata } from 'next';
import { ProductsTable } from '@/components/hq/ProductsTable';
import { Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Products Management | HQ Panel',
  description: 'Manage your store products, variants, and stock.',
};

export default function ProductsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Package size={20} />
            </div>
            <h1 className="text-4xl font-heading font-black tracking-tight">Products</h1>
          </div>
          <p className="text-muted-foreground font-medium max-w-2xl">
            Manage your entire product catalog, including variations, images, and pricing. Select multiple products to perform bulk actions.
          </p>
        </div>
      </div>

      <ProductsTable />
    </div>
  );
}
