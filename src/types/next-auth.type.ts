import _nextAuth from "next-auth";

declare module "next-auth" {
   // client session
   interface Session {
      token: string;
      refreshToken: string;
   }

   // login payload
   interface User {
      data: {
         token: string;
         refresh_token: string;
      };
   }
}

// extend token parameter in session callback
declare module "next-auth/jwt" {
   interface JWT {
      token: string;
      refreshToken: string;
   }
}
