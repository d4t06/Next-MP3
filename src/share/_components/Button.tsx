import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { ElementRef, forwardRef, MouseEventHandler, ReactNode, Ref } from "react";

const classes = {
   active:
      "",
   button: "button inline-flex relative items-center justify-center z-0",
};

const ButtonVariant = cva(classes.button, {
   variants: {
      variant: {
         primary:
            "variant--primary",
         clear: "",
      },
      size: {
         clear: "",
         primary: "px-[15px] py-[5px]",
      },
      colors: {
         primary: "text-amber-800 before:bg-amber-100",
         second: "text-amber-100 before:bg-amber-800",
         clear: "",
      },
      border: {
         primary: "before:border-[2px]",
         thin: "before:border-[1px]",
         clear: "before:border-b-[2px]",
      },
      fontWeight: {
         primary: "font-[500]",
         thin: "",
      },
   },
   defaultVariants: {
      size: "primary",
      colors: "primary",
      variant: "primary",
      border: "primary",
      fontWeight: "primary",
   },
});

interface Props extends VariantProps<typeof ButtonVariant> {
   onClick?: MouseEventHandler;
   loading?: boolean;
   children: ReactNode;
   disabled?: boolean;
   className?: string;
   type?: HTMLButtonElement["type"];
   href?: string;
   active?: boolean;
   blank?: boolean;
}
function Button(
   {
      onClick,
      disabled,
      type = "button",
      children,
      loading,
      className,
      size,
      variant,
      colors,
      href,
      active,
      blank,
      fontWeight,
      border,
   }: Props,
   ref: Ref<ElementRef<"button">>
) {
   const content = (
      <>
         {loading && <ArrowPathIcon className="w-[24px] animate-spin" />}
         {!loading && children}
      </>
   );

   return (
      <>
         {href ? (
            <Link
               href={href}
               aria-disabled={disabled}
               target={blank ? "_blank" : ""}
               className={`${ButtonVariant({
                  variant,
                  size,
                  colors,
                  border,
                  fontWeight,
                  className,
               })} ${active ? classes.active : ""}`}
            >
               {content}
            </Link>
         ) : (
            <button
               ref={ref}
               type={type || "button"}
               onClick={onClick}
               disabled={loading || disabled}
               className={`${ButtonVariant({
                  variant,
                  size,
                  colors,
                  border,
                  fontWeight,
                  className,
               })} ${active ? classes.active : ""}`}
            >
               {content}
            </button>
         )}
      </>
   );
}

export default forwardRef(Button);
