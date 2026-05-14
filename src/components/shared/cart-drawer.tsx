'use client';

import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { ProductImage } from './product-image';

export const CartDrawer = () => {
  const { items, open, setOpen, removeItem, updateQuantity, totalAmount, totalItems } =
    useCartStore();

  const total = totalAmount();
  const count = totalItems();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="relative z-10 bg-white w-full max-w-md flex flex-col h-full shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="text-lg font-extrabold">
              Корзина
              {count > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  {count} {count === 1 ? 'товар' : count < 5 ? 'товара' : 'товаров'}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-300">
            <ShoppingBag size={64} strokeWidth={1} />
            <p className="text-base font-medium">Корзина пуста</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-4 bg-gray-50 rounded-2xl"
                >
                  <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0">
                    <ProductImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.size} · {item.color}
                    </p>
                    <p className="font-bold mt-1">{item.price} ₽</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-gray-400 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-gray-400 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <p className="text-sm font-bold">
                      {item.price * item.quantity} ₽
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-5 border-t bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">Итого</span>
                <span className="text-2xl font-extrabold">{total} ₽</span>
              </div>
              <Link href="/checkout" onClick={() => setOpen(false)} className="block">
                <Button className="w-full h-12 text-base font-bold rounded-xl group">
                  Оформить заказ
                  <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
