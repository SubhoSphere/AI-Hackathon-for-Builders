import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: {
          scope: "repo read:user",
          client_id: process.env.GITHUB_CLIENT_ID,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Save the access token to the token state payload if it exists
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the access token from the token payload to the session object
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
