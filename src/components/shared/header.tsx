'use client';

import { cn } from '@/lib/utils';
import { Container } from './container';
import { Button } from '@/components/ui';
import { ArrowRight, ShoppingCart, Shirt, User, LogOut } from 'lucide-react';
import { SearchInput } from './search-input';
import { useAuthModalStore } from '@/store/auth-modal-store';
import { useCartStore } from '@/store/cart-store';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Suspense } from 'react';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const { setOpen } = useAuthModalStore();
  const { data: session } = useSession();
  const { setOpen: setCartOpen, totalItems } = useCartStore();
  const cartCount = totalItems();

  return (
    <header className={cn('border border-b', className)}>
      <Container className="flex items-center justify-between py-8 gap-8">
        <Link href="/" className="flex items-center gap-4 shrink-0 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black text-white">
            <Shirt size={22} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-2xl uppercase font-black">Next Clothes</h1>
            <p className="text-sm text-gray-400 leading-3">
              Your one-stop shop for the latest fashion trends
            </p>
          </div>
        </Link>

        <Suspense>
          <SearchInput />
        </Suspense>

        <div className="flex items-center gap-3 shrink-0">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-xs font-bold">
                  {session.user?.name?.[0]?.toUpperCase() ?? <User size={14} />}
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {session.user?.name}
                </span>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => signOut()}
              >
                <LogOut size={16} />
                Выйти
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setOpen(true)}
            >
              <User size={16} />
              Войти
            </Button>
          )}

          <Button className="group relative" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={18} strokeWidth={2} />
            {cartCount > 0 && (
              <span className="ml-2 font-bold">{cartCount}</span>
            )}
            <span className={cartCount > 0 ? "h-full w-[1px] bg-white/30 mx-2" : "hidden"} />
            {cartCount > 0 && (
              <>
                <span className="transition duration-300 group-hover:opacity-0 font-bold">
                  Корзина
                </span>
                <ArrowRight size={18} className="absolute right-4 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
              </>
            )}
          </Button>
        </div>
      </Container>
    </header>
  );
};
