import Button from "@/share/_components/Button";
import { ModalContentWrapper } from "./Modal";
import ModalHeader from "./ModalHeader";

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
      <ModalContentWrapper disable={loading}>
         <ModalHeader close={closeModal} title={label || "Wait a minute"} />
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
      </ModalContentWrapper>
   );
}
