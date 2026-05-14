import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const sizes = ['XS', 'S', 'M', 'L', 'XL'];

const generateVariants = (productId: number, price: number, colors: string[]) => {
  return colors.flatMap((color) =>
    sizes.map((size) => ({
      productId,
      price,
      size,
      color,
      stock: Math.floor(Math.random() * 20) + 1,
    })),
  );
};

async function up() {
  await prisma.user.createMany({
    data: [
      { fullName: 'Пользователь', email: 'user@example.com', role: 'USER' },
      { fullName: 'Администратор', email: 'admin@example.com', role: 'ADMIN' },
    ],
  });

  const tshirts = await prisma.category.create({ data: { name: 'Футболки' } });
  const hoodies = await prisma.category.create({ data: { name: 'Худи' } });
  const pants = await prisma.category.create({ data: { name: 'Брюки' } });
  const jackets = await prisma.category.create({ data: { name: 'Куртки' } });
  const dresses = await prisma.category.create({ data: { name: 'Платья' } });
  const shoes = await prisma.category.create({ data: { name: 'Обувь' } });
  const accessories = await prisma.category.create({ data: { name: 'Аксессуары' } });

  const products = await prisma.product.createManyAndReturn({
    data: [
      // Футболки
      {
        name: 'Базовая белая футболка',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&auto=format',
        description: 'Классическая футболка из 100% хлопка',
        categoryId: tshirts.id,
      },
      {
        name: 'Футболка оверсайз',
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8d4f369d4f3e?w=400&h=500&fit=crop&auto=format',
        description: 'Свободный крой, мягкий хлопок',
        categoryId: tshirts.id,
      },
      {
        name: 'Футболка с принтом',
        imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop&auto=format',
        description: 'Стильный принт, плотная ткань',
        categoryId: tshirts.id,
      },
      {
        name: 'Поло классическое',
        imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop&auto=format',
        description: 'Рубашка-поло из пике хлопка',
        categoryId: tshirts.id,
      },
      // Худи
      {
        name: 'Худи базовое',
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=500&fit=crop&auto=format',
        description: 'Мягкий флис, кенгуру-карман',
        categoryId: hoodies.id,
      },
      {
        name: 'Зип-худи',
        imageUrl: 'https://images.unsplash.com/photo-1604644309741-73cdde052de8?w=400&h=500&fit=crop&auto=format',
        description: 'Молния по всей длине, два кармана',
        categoryId: hoodies.id,
      },
      {
        name: 'Свитшот оверсайз',
        imageUrl: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=400&h=500&fit=crop&auto=format',
        description: 'Без капюшона, свободный силуэт',
        categoryId: hoodies.id,
      },
      // Брюки
      {
        name: 'Классические брюки',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop&auto=format',
        description: 'Прямой крой, высокая талия',
        categoryId: pants.id,
      },
      {
        name: 'Джоггеры',
        imageUrl: 'https://images.unsplash.com/photo-1509651157872-21a8888fd77b?w=400&h=500&fit=crop&auto=format',
        description: 'Спортивные брюки на манжетах',
        categoryId: pants.id,
      },
      {
        name: 'Карго-брюки',
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop&auto=format',
        description: 'Брюки с накладными карманами',
        categoryId: pants.id,
      },
      // Куртки
      {
        name: 'Бомбер',
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&auto=format',
        description: 'Классический бомбер на молнии',
        categoryId: jackets.id,
      },
      {
        name: 'Ветровка',
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop&auto=format',
        description: 'Лёгкая ветрозащитная куртка',
        categoryId: jackets.id,
      },
      {
        name: 'Пуховик',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&auto=format',
        description: 'Тёплый пуховик для холодной погоды',
        categoryId: jackets.id,
      },
      // Платья
      {
        name: 'Платье миди',
        imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop&auto=format',
        description: 'Элегантное платье длины миди',
        categoryId: dresses.id,
      },
      {
        name: 'Летнее платье',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&auto=format',
        description: 'Лёгкое платье из вискозы',
        categoryId: dresses.id,
      },
      // Обувь
      {
        name: 'Кроссовки классические',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&auto=format',
        description: 'Удобные кроссовки на каждый день',
        categoryId: shoes.id,
      },
      {
        name: 'Кеды',
        imageUrl: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=400&h=500&fit=crop&auto=format',
        description: 'Лёгкие парусиновые кеды',
        categoryId: shoes.id,
      },
      // Аксессуары
      {
        name: 'Кепка бейсболка',
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop&auto=format',
        description: 'Хлопковая бейсболка с регулятором',
        categoryId: accessories.id,
      },
      {
        name: 'Шопер',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&auto=format',
        description: 'Вместительная сумка-шопер',
        categoryId: accessories.id,
      },
    ],
  });

  const priceMap: Record<string, number> = {
    'Базовая белая футболка': 1490,
    'Футболка оверсайз': 1790,
    'Футболка с принтом': 1990,
    'Поло классическое': 2290,
    'Худи базовое': 3490,
    'Зип-худи': 3990,
    'Свитшот оверсайз': 2990,
    'Классические брюки': 3290,
    'Джоггеры': 2790,
    'Карго-брюки': 3990,
    'Бомбер': 5990,
    'Ветровка': 4990,
    'Пуховик': 8990,
    'Платье миди': 4290,
    'Летнее платье': 2990,
    'Кроссовки классические': 5490,
    'Кеды': 3490,
    'Кепка бейсболка': 1290,
    'Шопер': 1990,
  };

  const colorMap: Record<string, string[]> = {
    'Базовая белая футболка': ['Белый', 'Чёрный', 'Серый'],
    'Футболка оверсайз': ['Чёрный', 'Бежевый', 'Синий'],
    'Футболка с принтом': ['Чёрный', 'Белый'],
    'Поло классическое': ['Белый', 'Синий', 'Зелёный'],
    'Худи базовое': ['Чёрный', 'Серый', 'Бежевый'],
    'Зип-худи': ['Чёрный', 'Серый'],
    'Свитшот оверсайз': ['Серый', 'Белый', 'Бежевый'],
    'Классические брюки': ['Чёрный', 'Бежевый'],
    'Джоггеры': ['Чёрный', 'Серый'],
    'Карго-брюки': ['Хаки', 'Чёрный'],
    'Бомбер': ['Чёрный', 'Синий'],
    'Ветровка': ['Чёрный', 'Красный', 'Синий'],
    'Пуховик': ['Чёрный', 'Бежевый'],
    'Платье миди': ['Чёрный', 'Бежевый', 'Синий'],
    'Летнее платье': ['Белый', 'Голубой', 'Розовый'],
    'Кроссовки классические': ['Белый', 'Чёрный'],
    'Кеды': ['Белый', 'Чёрный'],
    'Кепка бейсболка': ['Чёрный', 'Белый', 'Бежевый'],
    'Шопер': ['Чёрный', 'Бежевый'],
  };

  const variantsData = products.flatMap((p) =>
    generateVariants(p.id, priceMap[p.name] ?? 1990, colorMap[p.name] ?? ['Чёрный']),
  );

  await prisma.productVariant.createMany({ data: variantsData });

  await prisma.cart.createMany({
    data: [
      { userId: 1, totalAmount: 0 },
      { userId: 2, totalAmount: 0 },
    ],
  });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductVariant" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "VerificationCode" RESTART IDENTITY CASCADE;`;
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
