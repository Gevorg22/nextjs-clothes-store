'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Loader2, ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container } from '@/components/shared/container';
import { useCartStore } from '@/store/cart-store';
import { ProductImage } from '@/components/shared/product-image';
import { FormField } from '@/components/shared/form-field';

const schema = z.object({
  fullName: z.string().min(2, 'Введите полное имя'),
  email: z.string().email('Некорректный email'),
  phone: z.string().min(7, 'Введите корректный телефон'),
  address: z.string().min(5, 'Введите адрес доставки'),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, totalAmount, clear } = useCartStore();
  const total = totalAmount();

  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  });

  React.useEffect(() => {
    if (items.length === 0 && !success) {
      router.replace('/');
    }
  }, [items.length, success]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items,
          totalAmount: total,
          userId: session?.user?.id ?? null,
        }),
      });

      if (!res.ok) throw new Error();

      clear();
      setSuccess(true);
    } catch {
      toast.error('Ошибка при оформлении заказа. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-black text-white">
          <CheckCircle size={40} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-2">Заказ оформлен!</h1>
          <p className="text-gray-500">Мы отправим подтверждение на ваш email</p>
        </div>
        <Link href="/">
          <Button className="mt-4">Продолжить покупки</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 max-w-5xl">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Назад к каталогу
      </Link>

      <h1 className="text-3xl font-extrabold mb-10">Оформление заказа</h1>

      <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-start">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-5">
          <h2 className="text-lg font-bold mb-1">Контактные данные</h2>

          <FormField label="Полное имя" error={errors.fullName?.message}>
            <Input {...register('fullName')} placeholder="Иван Иванов" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email" error={errors.email?.message}>
              <Input {...register('email')} type="email" placeholder="example@mail.com" />
            </FormField>
            <FormField label="Телефон" error={errors.phone?.message}>
              <Input {...register('phone')} placeholder="+7 (999) 000-00-00" />
            </FormField>
          </div>

          <FormField label="Адрес доставки" error={errors.address?.message}>
            <Input {...register('address')} placeholder="г. Москва, ул. Примерная, д. 1, кв. 1" />
          </FormField>

          <FormField label="Комментарий к заказу (необязательно)" error={errors.comment?.message}>
            <textarea
              {...register('comment')}
              placeholder="Любые пожелания..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none h-24 outline-none focus:ring-2 focus:ring-ring/20 transition"
            />
          </FormField>

          <Button type="submit" className="w-full h-12 text-base font-bold mt-2" disabled={loading}>
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              `Оформить заказ · ${total} ₽`
            )}
          </Button>
        </form>

        <div className="w-full md:w-80 shrink-0">
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <ShoppingBag size={18} />
              <h2 className="font-bold">Ваш заказ</h2>
            </div>

            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="relative w-14 h-14 bg-white rounded-xl overflow-hidden shrink-0">
                    <ProductImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.size} · {item.color}</p>
                    <p className="text-xs text-gray-400">× {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold shrink-0">{item.price * item.quantity} ₽</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-5 pt-4 flex justify-between items-center">
              <span className="text-gray-500">Итого</span>
              <span className="text-xl font-extrabold">{total} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}


