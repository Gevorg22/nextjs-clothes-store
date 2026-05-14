'use client';

import dynamic from 'next/dynamic';

const AuthModal = dynamic(() =>
  import('./auth-modal').then((m) => m.AuthModal), { ssr: false }
);
const CartDrawer = dynamic(() =>
  import('./cart-drawer').then((m) => m.CartDrawer), { ssr: false }
);
const ProductModal = dynamic(() =>
  import('./product-modal').then((m) => m.ProductModal), { ssr: false }
);

export const ClientModals = () => (
  <>
    <AuthModal />
    <CartDrawer />
    <ProductModal />
  </>
);
