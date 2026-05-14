'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X, ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { ProductImage } from './product-image';

interface Variant {
  id: number;
  size: string;
  color: string;
  price: number;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  description: string | null;
  category: { name: string };
  variants: Variant[];
}

export const ProductModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const productId = params.get('product');

  const { addItem, setOpen: setCartOpen } = useCartStore();

  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);

  const close = () => {
    const current = new URLSearchParams(params.toString());
    current.delete('product');
    const qs = current.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  React.useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }
    setSelectedSize(null);
    setSelectedColor(null);
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [productId]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [params]);

  if (!productId) return null;

  const sizes = product ? [...new Set(product.variants.map((v) => v.size))] : [];

  const availableColors = product
    ? [
        ...new Set(
          product.variants
            .filter((v) => (!selectedSize || v.size === selectedSize) && v.stock > 0)
            .map((v) => v.color),
        ),
      ]
    : [];

  const selectedVariant =
    product && selectedSize && selectedColor
      ? product.variants.find((v) => v.size === selectedSize && v.color === selectedColor)
      : null;

  const displayPrice = selectedVariant?.price ?? product?.variants[0]?.price ?? 0;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price,
      quantity: 1,
    });
    toast.success(`${product.name} добавлен в корзину`);
    close();
    setCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden flex max-h-[90vh]">
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X size={16} />
        </button>

        {loading || !product ? (
          <div className="flex items-center justify-center w-full h-80">
            <Loader2 size={32} className="animate-spin text-gray-300" />
          </div>
        ) : (
          <>
            <div className="relative w-72 shrink-0 bg-gray-50 flex items-center justify-center p-8">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                className="object-cover rounded-2xl"
              />
            </div>

            <div className="flex-1 p-8 overflow-y-auto flex flex-col">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                {product.category.name}
              </p>
              <h2 className="text-2xl font-extrabold mb-2">{product.name}</h2>
              {product.description && (
                <p className="text-sm text-gray-500 mb-6">{product.description}</p>
              )}

              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Размер
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSelectedColor(null); }}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all',
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-400',
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Цвет
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all',
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-400',
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <p className="text-3xl font-extrabold mb-4">{displayPrice} ₽</p>
                {selectedVariant && selectedVariant.stock <= 5 && (
                  <p className="text-xs text-orange-500 mb-3 font-medium">
                    Осталось {selectedVariant.stock} шт.
                  </p>
                )}
                <Button
                  className="w-full h-12 text-base font-bold rounded-xl"
                  disabled={!selectedSize || !selectedColor}
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={18} className="mr-2" />
                  {!selectedSize
                    ? 'Выберите размер'
                    : !selectedColor
                    ? 'Выберите цвет'
                    : 'Добавить в корзину'}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
