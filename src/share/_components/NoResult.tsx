import Image from "next/image";
import { ReactNode } from "react";

export default function NoResult({ children }: { children?: ReactNode }) {
   return (
      <>
         <div className="mt-[30px] text-center font-medium space-y-1">
            <Image
               width={120}
               height={120}
               className="m-auto"
               src={
                  "https://d4t06.github.io/Vue-Mobile/assets/search-empty-ChRLxitn.png"
               }
               alt=""
            />

            {children ? children : <p>No result found, ¯\_(ツ)_/¯ </p>}
         </div>
      </>
   );
}
