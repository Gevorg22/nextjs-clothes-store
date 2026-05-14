'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Title } from './title';
import { ProductImage } from './product-image';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  className?: string;
}

export const ProductCard = ({ id, name, price, imageUrl, description, className }: ProductCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const openModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const current = new URLSearchParams(params.toString());
    current.set('product', String(id));
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  return (
    <div className={cn('cursor-pointer group', className)} onClick={openModal}>
      <div className="relative flex justify-center p-6 bg-secondary rounded-2xl h-65 overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
        <ProductImage src={imageUrl} alt={name} className="object-cover" />
      </div>
      <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />
      <p className="text-sm text-gray-400 line-clamp-1">{description}</p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-[20px]">
          от <b>{price} ₽</b>
        </span>
        <Button variant="secondary" onClick={openModal}>
          <Plus size={20} className="mr-1" />
          Добавить
        </Button>
      </div>
    </div>
  );
};
