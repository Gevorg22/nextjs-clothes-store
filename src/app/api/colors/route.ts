import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await prisma.productVariant.findMany({
    distinct: ["color"],
    select: { color: true },
    orderBy: { color: "asc" },
  });

  return NextResponse.json(rows.map((r) => r.color));
}
