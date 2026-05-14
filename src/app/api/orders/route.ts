import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  const orders = await prisma.order.findMany({
    where: email ? { email } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const { fullName, email, phone, address, comment, items, totalAmount } =
    await request.json();

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 });
  }

  try {
    const order = await prisma.order.create({
      data: {
        fullName,
        email,
        phone,
        address,
        comment: comment ?? null,
        items,
        totalAmount: Number(totalAmount),
        status: 'PENDING',
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    console.error('[ORDER CREATE ERROR]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
