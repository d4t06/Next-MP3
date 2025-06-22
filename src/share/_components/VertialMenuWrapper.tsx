import { ReactNode } from "react";

type Props = {
   className?: string;
   children: ReactNode;
};

export default function VertialMenuWrapper({
   children,
   className = "",
}: Props) {
   const classes = {
      container:
         "hover:[&>*:not(div.absolute)]:bg-white/5 [&>*]:px-3 [&>*]:py-2 [&>*]:w-full [&>*]:space-x-2 [&>*]:text-sm [&>*]:flex [&>*]:items-center [&_svg]:w-6  [&_svg]:flex-shrink-0 [&>*]:items-center [&_span]:font-medium",
   };

   return <div className={`${classes.container} ${className}`}>{children}</div>;
}
