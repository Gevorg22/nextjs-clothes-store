import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL"];

export async function GET() {
  const rows = await prisma.productVariant.findMany({
    distinct: ["size"],
    select: { size: true },
  });

  const sizes = rows
    .map((r) => r.size)
    .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));

  return NextResponse.json(sizes);
}
