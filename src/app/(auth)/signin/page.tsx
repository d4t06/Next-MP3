import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/authOption";
import SignInForm from "@/components/SignInForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
   const session = await getServerSession(nextAuthOptions);
   if (session?.token) return redirect("/dashboard");

   return (
      <>
         <SignInForm />
      </>
   );
}
