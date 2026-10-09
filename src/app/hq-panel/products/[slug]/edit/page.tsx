"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/hq/ProductForm';
import api from '@/services/api';

export default function EditProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/catalog/products/${slug}/`);
        // Adapt data if necessary for the form
        // Form expects variant IDs to be mapped correctly, etc.
        setProductData(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError('Failed to load product. It may not exist.');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">{error || "Product not found"}</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <ProductForm isEdit={true} initialData={productData} />
    </div>
  );
}
