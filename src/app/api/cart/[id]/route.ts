import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { quantity } = await request.json();

  const item = await prisma.cartItem.update({
    where: { id: Number(id) },
    data: { quantity: Number(quantity) },
    include: { variant: true },
  });

  return NextResponse.json(item);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.cartItem.delete({ where: { id: Number(id) } });

  return NextResponse.json({ success: true });
}
