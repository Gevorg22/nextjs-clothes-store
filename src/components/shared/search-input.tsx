'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductResult {
  id: number;
  name: string;
  imageUrl: string;
  category: { name: string };
  variants: { price: number }[];
}

export const SearchInput = ({ className }: { className?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<ProductResult[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const openProduct = (id: number) => {
    const current = new URLSearchParams(params.toString());
    current.set('product', String(id));
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
    setOpen(false);
    setQuery('');
  };

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={cn('relative flex-1 max-w-[420px]', className)}>
      <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Поиск одежды..."
          className="bg-transparent outline-none w-full text-sm placeholder:text-gray-400"
        />
        {loading && (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin shrink-0" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => openProduct(product.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={40}
                height={40}
                className="rounded-lg object-cover bg-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-gray-400">{product.category.name}</p>
              </div>
              {product.variants[0] && (
                <span className="text-sm font-bold shrink-0">
                  от {product.variants[0].price} ₽
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && !loading && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 px-4 py-6 text-center">
          <p className="text-sm text-gray-400">Ничего не найдено</p>
        </div>
      )}
    </div>
  );
};
