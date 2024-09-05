"use client";

import Button from "@/share/_components/Button";
import Frame from "@/share/_components/Frame";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ElementRef, FormEvent, useRef, useState } from "react";

export default function SignInForm() {
   const [password, setPassword] = useState("");

   const [errMsg, setErrorMsg] = useState("");
   const [fetching, setFetching] = useState(false);

   const inputRef = useRef<ElementRef<"input">>(null);

   // hooks
   const router = useRouter();

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      setFetching(true);
      setErrorMsg("");

      const res = await signIn("credentials", {
         password,
         redirect: false,
      });

      if (res?.status === 401) {
         setErrorMsg("Invalid password");
         setFetching(false);
         return;
      }

      router.push("/dashboard");
   };

   const classes = {
      wrapper:
         "!absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[400px] max-w-[100vw]",
      formContainer: "space-y-[22px] text-amber-100 p-[10px]",
      label: "font-[500] ",
      errMsg:
         "font-[500] text-amber-800 text-center bg-amber-100 py-[4px] rounded-[6px]",
   };

   return (
      <>
         <div className={classes.wrapper}>
            <Frame pushAble={"clear"}>
               <form onSubmit={handleSubmit} className={classes.formContainer}>
                  {errMsg && !fetching && (
                     <h2 className={`${classes.errMsg}`}>{errMsg}</h2>
                  )}
                  <h1 className="text-center text-2xl font-semibold">
                     Sign In
                  </h1>
                  <div className={"space-y-[6px]"}>
                     <label className={classes.label} htmlFor="image">
                        Password
                     </label>
                     <input
                        ref={inputRef}
                        type="text"
                        className="w-full bg-amber-900 py-2 rounded-lg outline-none px-2"
                        autoComplete="off"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>

                  <Button
                     loading={fetching}
                     className="h-[40px] w-full"
                     type="submit"
                     colors={"second"}
                  >
                     Sign In
                  </Button>
               </form>
            </Frame>
         </div>
      </>
   );
}
