# Next Clothes

Интернет-магазин одежды на Next.js с каталогом товаров, фильтрацией, корзиной и оформлением заказа.

**Деплой:** https://nextjs-clothes-store.vercel.app

## Технологии

Next.js, TypeScript, TailwindCSS, ShadCN, Prisma, PostgreSQL, NextAuth, Zustand, React Hook Form, Zod, Resend

## Функциональность

Каталог товаров по категориям, фильтрация по размеру, цвету и цене, сортировка, поиск, модальная карточка товара с выбором варианта, корзина, страница оформления заказа, авторизация по email с кодом подтверждения.

## Запуск

```bash
npm install
npm run dev
```

Перед запуском создайте `.env` файл с переменными `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `RESEND_API_KEY`.

```bash
npx prisma db push
npm run seed
```
