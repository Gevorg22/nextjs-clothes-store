import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const categoryId = searchParams.get("categoryId");
  const size = searchParams.get("size");
  const color = searchParams.get("color");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(categoryId && { categoryId: Number(categoryId) }),
      variants: {
        some: {
          ...(size && { size }),
          ...(color && { color }),
          ...(minPrice || maxPrice
            ? {
                price: {
                  ...(minPrice && { gte: Number(minPrice) }),
                  ...(maxPrice && { lte: Number(maxPrice) }),
                },
              }
            : {}),
        },
      },
    },
    include: {
      category: true,
      variants: { orderBy: { price: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
