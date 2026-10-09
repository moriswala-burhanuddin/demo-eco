export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number | null;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Color {
  id: number;
  name: string;
  hex_code: string;
}

export interface Size {
  id: number;
  name: string;
}

export interface Variant {
  id: number;
  product: number;
  sku: string;
  upc: string;
  color_name: string;
  size: number;
  size_name: string;
  selling_price: string;
  weight: string;
  is_active: boolean;
  offer_price?: string;
  offer_badge?: string;
}

export interface MediaFile {
  id: string;
  file: string;
  file_type: string;
  webp_version: string;
  thumbnail: string;
  alt_text: string;
}

export interface ProductMedia {
  id: number;
  media_file: MediaFile;
  is_primary: boolean;
  order: number;
  webp_url: string | null;
  thumbnail_url: string | null;
  original_url: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: Category;
  brand: Brand;
  is_active: boolean;
  
  // Comparison fields
  rating: string | number;
  material: string;
  delivery_days: number;
  warranty_years: number;
  
  variants: Variant[];
  media: ProductMedia[];
  best_offer_price?: string;
  best_offer_badge?: string;
}
