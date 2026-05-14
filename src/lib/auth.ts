import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const code = credentials?.code as string;

        if (!email || !code) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const verification = await prisma.verificationCode.findFirst({
          where: {
            userId: user.id,
            code,
            expiresAt: { gt: new Date() },
          },
        });

        if (!verification) return null;

        await prisma.verificationCode.delete({ where: { id: verification.id } });

        return { id: String(user.id), name: user.fullName, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
});
