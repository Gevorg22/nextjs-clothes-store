'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Title } from './title';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { Input } from '../ui/input';
import { RangeSlider } from '../ui/range-slider';
import { X } from 'lucide-react';
import { SIZES, COLORS, MIN_PRICE, MAX_PRICE } from '@/lib/constants';

interface FiltersProps {
  className?: string;
}

export const Filters = ({ className }: FiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    Number(params.get('minPrice') ?? MIN_PRICE),
    Number(params.get('maxPrice') ?? MAX_PRICE),
  ]);

  const selectedSizes = params.get('sizes')?.split(',').filter(Boolean) ?? [];
  const selectedColors = params.get('colors')?.split(',').filter(Boolean) ?? [];

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 15000;

  const clearFilters = () => {
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    const current = new URLSearchParams(params.toString());
    current.delete('sizes');
    current.delete('colors');
    current.delete('minPrice');
    current.delete('maxPrice');
    const qs = current.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const updateParam = (key: string, values: string[]) => {
    const current = new URLSearchParams(params.toString());
    if (values.length > 0) {
      current.set(key, values.join(','));
    } else {
      current.delete(key);
    }
    router.push(`?${current.toString()}`, { scroll: false });
  };

  const updatePrice = (range: [number, number]) => {
    const current = new URLSearchParams(params.toString());
    current.set('minPrice', String(range[0]));
    current.set('maxPrice', String(range[1]));
    router.push(`?${current.toString()}`, { scroll: false });
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-5">
        <Title text="Фильтрация" size="sm" className="font-bold" />
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-black transition-colors"
          >
            <X size={12} />
            Очистить
          </button>
        )}
      </div>

      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={15000}
            value={priceRange[0]}
            onChange={(e) => {
              const val: [number, number] = [Number(e.target.value), priceRange[1]];
              setPriceRange(val);
              updatePrice(val);
            }}
          />
          <Input
            type="number"
            min={100}
            max={15000}
            placeholder="15000"
            value={priceRange[1]}
            onChange={(e) => {
              const val: [number, number] = [priceRange[0], Number(e.target.value)];
              setPriceRange(val);
              updatePrice(val);
            }}
          />
        </div>
        <RangeSlider
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={100}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          onValueCommit={(v) => updatePrice(v as [number, number])}
        />
      </div>

      <CheckboxFiltersGroup
        className="mt-5"
        title="Размер"
        limit={6}
        defaultValue={selectedSizes}
        defaultItems={SIZES.map((s) => ({ text: s, value: s }))}
        items={SIZES.map((s) => ({ text: s, value: s }))}
        onChange={(values) => updateParam('sizes', values)}
      />

      <CheckboxFiltersGroup
        className="mt-5"
        title="Цвет"
        limit={5}
        defaultValue={selectedColors}
        defaultItems={COLORS.slice(0, 5).map((c) => ({ text: c, value: c }))}
        items={COLORS.map((c) => ({ text: c, value: c }))}
        onChange={(values) => updateParam('colors', values)}
      />
    </div>
  );
};
