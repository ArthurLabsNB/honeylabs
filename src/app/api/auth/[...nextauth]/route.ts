export const runtime = 'nodejs'

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@lib/prisma'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import FacebookProvider from 'next-auth/providers/facebook'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
  ],
  session: { strategy: 'database' },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
