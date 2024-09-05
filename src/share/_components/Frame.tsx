import { VariantProps, cva } from "class-variance-authority";
import { ReactNode } from "react";

const classes = {
   container: `relative before:absolute before:content-[""] before:inset-0 z-0 before:bg-amber-800 before:border-amber-900 before:z-[-1] `,
};

const FrameVariant = cva(classes.container, {
   variants: {
      size: {
         primary:
            "before:rounded-2xl before:bg-amber-800 before:border-[4px] before:shadow-[0_4px_0_#78350f] p-[14px] active:translate-y-[4px]",
         small: "before:rounded-lg before:border-[2px] before:shadow-[0_2px_0_#78350f] p-[10px] active:translate-y-[2px]",
      },
      pushAble: {
         primary: "active:before:shadow-none",
         clear: "active:translate-y-[none]",
      },
   },

   defaultVariants: {
      size: "primary",
      pushAble: "primary",
   },
});

interface Props extends VariantProps<typeof FrameVariant> {
   children: ReactNode;
   className?: string;
}

export default function Frame({ children, className, pushAble, size }: Props) {
   return (
      <div className={FrameVariant({ size, pushAble, className })}>
         {children}
      </div>
   );
}
