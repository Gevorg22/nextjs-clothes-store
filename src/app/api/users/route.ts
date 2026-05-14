import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { fullName, email, role } = await request.json();

  const user = await prisma.user.create({
    data: { fullName, email, role },
  });

  return NextResponse.json(user, { status: 201 });
}
