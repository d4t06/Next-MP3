import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function usePrivateRequest() {
   const router = useRouter();

   const request = async (input: string, init?: RequestInit) => {
      const res = await fetch(input, init);
      if (!res.ok) {
         if (res.status === 401) {
            await signOut({ redirect: false });
            router.push("/signin");

            return;
         } else throw new Error();
      }

      return await res.json();
   };

   return { request };
}
