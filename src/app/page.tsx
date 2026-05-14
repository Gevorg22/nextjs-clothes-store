import { Container, Title, Filters, ProductsGroupList } from '@/components/shared';
import { TopBar } from '@/components/shared/top-bar';
import { prisma } from '@/lib/db';
import { Suspense } from 'react';

interface HomeProps {
  searchParams: Promise<{
    sizes?: string;
    colors?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const sizes = params.sizes?.split(',').filter(Boolean) ?? [];
  const colors = params.colors?.split(',').filter(Boolean) ?? [];
  const minPrice = params.minPrice ? Number(params.minPrice) : 0;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : 15000;
  const sort = params.sort ?? 'popular';

  const dbOrderBy =
    sort === 'new' ? { createdAt: 'desc' as const } : { id: 'asc' as const };

  const rawCategories = await prisma.category.findMany({
    include: {
      products: {
        where: {
          active: true,
          ...(sizes.length > 0 || colors.length > 0 || minPrice > 0 || maxPrice < 15000
            ? {
                variants: {
                  some: {
                    ...(sizes.length > 0 && { size: { in: sizes } }),
                    ...(colors.length > 0 && { color: { in: colors } }),
                    price: { gte: minPrice, lte: maxPrice },
                  },
                },
              }
            : {}),
        },
        include: {
          variants: { orderBy: { price: 'asc' } },
        },
        orderBy: dbOrderBy,
      },
    },
    orderBy: { id: 'asc' },
  });

  const getMinPrice = (p: { variants: { price: number }[] }) =>
    p.variants.length > 0 ? Math.min(...p.variants.map((v) => v.price)) : 0;

  const categories = rawCategories.map((cat) => ({
    ...cat,
    products:
      sort === 'price_asc'
        ? [...cat.products].sort((a, b) => getMinPrice(a) - getMinPrice(b))
        : sort === 'price_desc'
          ? [...cat.products].sort((a, b) => getMinPrice(b) - getMinPrice(a))
          : cat.products,
  }));

  return (
    <>
      <Container className="mt-10">
        <Title text="Все товары" size="lg" className="font-extrabold" />
      </Container>

      <TopBar />
      <Container className="mt-6 md:mt-10 pb-14">
        <div className="flex gap-10 lg:gap-20">
          <div className="hidden md:block w-56 lg:w-62.5 shrink-0">
            <Suspense>
              <Filters />
            </Suspense>
          </div>
          <div className="flex flex-col gap-10 md:gap-16 flex-1">
            {categories.map((category) =>
              category.products.length > 0 ? (
                <ProductsGroupList
                  key={category.id}
                  title={category.name}
                  categoryId={category.id}
                  items={category.products}
                />
              ) : null,
            )}
            {categories.every((c) => c.products.length === 0) && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                <p className="text-lg font-semibold">Товары не найдены</p>
                <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
