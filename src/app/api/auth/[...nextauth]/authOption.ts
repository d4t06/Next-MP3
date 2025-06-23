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

            if (!res.ok) throw new Error("");

            const payload = await res.json();

            return payload;
         },
      }),
   ],
   session: {
      maxAge: 60 * 60 * 24 * 29,
   },

   pages: {
      signIn: "/signin",
   },
   callbacks: {
      // token for persist auth
      // user is the response from login method
      // session is payload when call update()
      async jwt({ token, user: loginPayload, trigger, session }) {
         switch (trigger) {
            case "signIn":
               return {
                  refreshToken: loginPayload.data.refresh_token,
                  token: loginPayload.data.token,
               };

            case "update": {
               Object.assign(token, session);
               break;
            }
         }

         return token;
      },

      // for client side
      async session({ token, session }) {
         session.token = token.token;
         session.refreshToken = token.refreshToken;

         return session;
      },
   },
};
