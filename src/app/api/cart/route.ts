import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId обязателен" }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: Number(userId) },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  });

  return NextResponse.json(cart);
}

export async function POST(request: NextRequest) {
  const { userId, variantId, quantity = 1 } = await request.json();

  const cart = await prisma.cart.upsert({
    where: { userId: Number(userId) },
    create: { userId: Number(userId), totalAmount: 0 },
    update: {},
  });

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, variantId: Number(variantId), userId: Number(userId) },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId: Number(variantId),
        userId: Number(userId),
        quantity,
      },
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: { include: { variant: { include: { product: true } } } },
    },
  });

  const totalAmount = updatedCart!.items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  await prisma.cart.update({
    where: { id: cart.id },
    data: { totalAmount },
  });

  return NextResponse.json({ ...updatedCart, totalAmount }, { status: 201 });
}
