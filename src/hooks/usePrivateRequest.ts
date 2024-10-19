import { useSession } from "next-auth/react";

export default function usePrivateRequest() {
   const { update } = useSession();

   const request = async (input: string, init?: RequestInit) => {
      const res = await fetch(input, init);
      if (!res.ok) {
         if (res.status === 401) await update();
         throw new Error();
      }

      return res.json();
   };

   return {request};
}
