'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SORT_OPTIONS } from '@/lib/constants';

interface SortPopupProps {
  className?: string;
}

export const SortPopup = ({ className }: SortPopupProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = React.useState(false);

  const currentSort = params.get('sort') ?? 'popular';
  const currentLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? 'популярное';

  const setSort = (value: string) => {
    const current = new URLSearchParams(params.toString());
    current.set('sort', value);
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div
          className={cn(
            'inline-flex items-center gap-1 bg-gray-50 px-5 h-[52px] rounded-2xl cursor-pointer',
            className
          )}
        >
          <ArrowUpDown size={16} />
          <b>Сортировка:</b>
          <b className="text-primary ml-1">{currentLabel}</b>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-1">
        <ul>
          {SORT_OPTIONS.map((option) => (
            <li
              key={option.value}
              onClick={() => setSort(option.value)}
              className={cn(
                'p-2 px-4 cursor-pointer rounded-md transition-colors',
                currentSort === option.value
                  ? 'bg-black text-white font-semibold'
                  : 'hover:bg-gray-100'
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
