import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") ?? "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: {
      category: { select: { name: true } },
      variants: { orderBy: { price: "asc" }, take: 1 },
    },
    take: 10,
  });

  return NextResponse.json(products);
}
