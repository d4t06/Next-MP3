'use client'

import { ReactNode } from "react";

type Props = {
   children: ReactNode;
   onClick: () => void;
   className?: string;
};

export default function OnClickWrapper({
   children,
   className = "",
   onClick,
}: Props) {
   return (
      <div className={className} onClick={onClick}>
         {children}
      </div>
   );
}
