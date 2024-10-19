import { API_ENDPOINT } from "@/share/utils/appHelper";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

const CLIENT_TOKEN_EXPIRE = 60 * 60; //1h

async function refreshToken(tokenData: JWT) {
   try {
      console.log(">>> refresh token");

      const res = await fetch(`${API_ENDPOINT}/auth/refresh`, {
         method: "POST",
         body: JSON.stringify({ refresh_token: tokenData.refreshToken }),
         headers: {
            "Content-type": "application/json",
         },
      });

      const payload = await res.json();

      if (!payload.data) throw new Error();

      return {
         ...tokenData,
         tokenExpired: Date.now() + CLIENT_TOKEN_EXPIRE * 1000,
         token: payload.data.token,
         error: "",
      };
   } catch (error) {
      console.log(">>> refresh token error");
      return {
         ...tokenData,
         error: "RefreshAccessTokenError",
      };
   }
}

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

            const payload = await res.json();

            return payload.data;
         },
      }),
   ],
   session: {
      strategy: "jwt",
   },

   pages: {
      signIn: "/signin",
   },
   /** this callbacks list run twice when the first them user meet the page
    * but the the second one can't get the date return from the first one
    * so this if statement in jwt below don't work
    */
   callbacks: {
      async jwt({ token, user }) {
         // if (token.error) return token; // not work

         /** only when logging
          * user is data return from authorize function above */
         if (user)
            return {
               token: user.token,
               refreshToken: user.refresh_token,
               error: "",
               tokenExpired: Date.now() + CLIENT_TOKEN_EXPIRE * 1000,
            } as JWT;

         if (token.tokenExpired > Date.now()) return { ...token, error: "" };

         return refreshToken(token);
      },

      // store client session context
      async session({ token, session }) {
         session.token = token.token;
         session.refreshToken = token.refreshToken;
         session.error = token.error;

         return session;
      },
   },
};
