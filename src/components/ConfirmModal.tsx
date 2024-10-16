import Button from "@/share/_components/Button";

type Props = {
   callback: () => void;
   label?: string;
   desc?: string;
   buttonLabel?: string;
   loading: boolean;
   className?: string;
   closeModal: () => void;
};

export default function ConfirmModal({
   loading,
   callback,
   label,
   closeModal,
   buttonLabel,
   desc = "This action cannot be undone",
   className,
}: Props) {
   return (
      <div
         className={`text-amber-800 ${
            className || "w-[500px] max-w-[calc(90vw-40px)]"
         } ${loading ? "opacity-60 pointer-events-none" : ""}`}
      >
         <h1 className="text-[20px] font-semibold">
            {label || "Wait a minute"}
         </h1>
         {desc && (
            <p className=" text-[16px] font-semibold text-red-500">{desc}</p>
         )}

         <div className="flex gap-[10px] mt-[20px]">
            <Button onClick={closeModal}>Close</Button>
            <Button
               colors={"second"}
               className="min-w-[120px]"
               loading={loading}
               onClick={callback}
            >
               {buttonLabel || "Yes please"}
            </Button>
         </div>
      </div>
   );
}
