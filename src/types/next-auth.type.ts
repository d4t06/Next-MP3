import _nextAuth from "next-auth";

declare module "next-auth" {
   interface Session {
      token: string;
      error: string;
      refreshToken: string;
   }

   interface User {
      token: string;
      refresh_token: string;
   }
}

declare module "next-auth/jwt" {
   interface JWT {
      token: string;
      tokenExpired: number;
      refreshToken: string;
      error: string;
   }
}
