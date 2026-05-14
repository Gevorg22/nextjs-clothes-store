'use client';

import React, { useEffect, useRef } from 'react';
import { Title } from './title';
import { ProductCard } from './product-card';
import { useIntersection } from 'react-use';
import { useCategoryStore } from '@/store/category';
import { ProductVariant } from '@/types';

interface ProductItem {
  id: number;
  name: string;
  imageUrl: string;
  description: string | null;
  variants: ProductVariant[];
}

interface ProductsGroupListProps {
  title: string;
  items: ProductItem[];
  categoryId: number;
  className?: string;
}

export const ProductsGroupList = ({
  title,
  items,
  categoryId,
  className,
}: ProductsGroupListProps) => {
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);

  const intersectionRef = useRef<HTMLDivElement>(null);

  const intersection = useIntersection(intersectionRef as React.RefObject<HTMLElement>, {
    threshold: 0.4,
  });

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [intersection?.isIntersecting, categoryId, title]);

  return (
    <div className={className} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" className="font-extrabold mb-5" />
      <div className="grid grid-cols-3 gap-12.5">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.variants[0].price}
            description={product.description ?? undefined}
          />
        ))}
      </div>
    </div>
  );
};
