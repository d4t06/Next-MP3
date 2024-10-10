import { API_ENDPOINT } from "@/share/utils/appHelper";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const nextAuthOptions: NextAuthOptions = {
   providers: [
      Credentials({
         type: "credentials",
         credentials: {
            username: {},
            password: {},
         },
         async authorize(credentials) {
            if (!credentials?.password) {
               return null;
            }

            const { password } = credentials;

            const res = await fetch(`${API_ENDPOINT}/auth/login`, {
               method: "POST",
               body: JSON.stringify({
                  password,
               }),
               headers: {
                  "Content-type": "application/json",
               },
            });

            if (!res.ok) return null;

            const user = await res.json();

            return user;
         },
      }),
   ],
   session: {
      // default
      strategy: "jwt",
      maxAge: 86400 * 2, //2day
   },

   pages: {
      signIn: "/signin",
   },
   callbacks: {
      async jwt({ token, user }) {
         if (user) return { ...token, ...user };
         return token;
      },

      // if use role in client component
      async session({ token, session }) {
         session.token = token.token;

         return session;
      },
   },
};
