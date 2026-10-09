import { Metadata } from 'next';
import { ProductForm } from '@/components/hq/ProductForm';

export const metadata: Metadata = {
  title: 'Create Product | HQ Panel',
  description: 'Add a new product to your catalog.',
};

export default function NewProductPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <ProductForm isEdit={false} />
    </div>
  );
}
