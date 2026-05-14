export interface CartItem {
  variantId: number;
  productId: number;
  name: string;
  imageUrl: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  price: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  description: string | null;
  category: { name: string };
  variants: ProductVariant[];
}

export type SortOption = 'popular' | 'new' | 'price_asc' | 'price_desc';
