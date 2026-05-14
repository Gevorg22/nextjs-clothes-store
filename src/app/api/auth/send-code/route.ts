import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email обязателен' }, { status: 400 });
  }

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: { email, fullName: email.split('@')[0] },
    });
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.verificationCode.upsert({
    where: { userId: user.id },
    create: { userId: user.id, code, expiresAt },
    update: { code, expiresAt },
  });

  await resend.emails.send({
    from: 'Next Clothes <onboarding@resend.dev>',
    to: email,
    subject: 'Код входа в Next Clothes',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 8px">Код входа</h2>
        <p style="color:#6b7280;margin:0 0 24px">Используйте этот код для входа в Next Clothes. Он действителен 5 минут.</p>
        <div style="font-size:36px;font-weight:700;letter-spacing:8px;text-align:center;padding:24px;background:#f9fafb;border-radius:12px">
          ${code}
        </div>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
