import { useRef, useState } from "react";
import useExportLyric from "../_hooks/useExportLyric";
import {
   Button,
   MenuContentWrapper,
   Modal,
   ModalContentWrapper,
   ModalHeader,
   ModalRef,
   VertialMenuWrapper,
   PopupContent,
   PopupTrigger,
   TriggerRef,
   Popup,
} from "@/share/_components";

import {
   ArrowDownTrayIcon,
   ArrowPathIcon,
   ArrowTopRightOnSquareIcon,
   Bars3Icon,
   PencilIcon,
} from "@heroicons/react/24/outline";
import useImportLyric from "../_hooks/useImportLyric";
import EditStringLyicModal from "./EditStringLyricModal";
import SyncLyricModal from "./SyncLyricModal";

type Modal = "lyric" | "tutorial" | "song-beat" | "sync" | "export";

type Props = {
   pause: () => void;
};

export default function MenuBtn({ pause }: Props) {
   const [modal, setModal] = useState<Modal | "">("");

   const modalRef = useRef<ModalRef>(null);
   const triggerRef = useRef<TriggerRef>(null);

   const { handleInputChange } = useImportLyric();
   const { exportLyric } = useExportLyric();

   const openModal = (m: Modal) => {
      pause();
      setModal(m);
      modalRef.current?.open();
      triggerRef.current?.close();
   };

   const closeModal = () => modalRef.current?.close();

   const renderModal = () => {
      if (!modal) return;

      switch (modal) {
         case "lyric":
            return <EditStringLyicModal closeModal={closeModal} />;
         case "sync":
            return <SyncLyricModal closeModal={closeModal} />;

         case "export":
            return (
               <ModalContentWrapper>
                  <ModalHeader title="Export" close={closeModal} />

                  <div className="flex">
                     <Button
                        onClick={() =>
                           exportLyric({
                              type: "json",
                           })
                        }
                     >
                        JSON
                     </Button>
                     <Button
                        onClick={() =>
                           exportLyric({
                              type: "srt",
                           })
                        }
                        className="ml-2"
                     >
                        SRT
                     </Button>
                  </div>
               </ModalContentWrapper>
            );
      }
   };

   return (
      <>
         <input
            id="import_lyric"
            onChange={handleInputChange}
            type="file"
            className="hidden"
         />

         <Popup appendOnPortal>
            <PopupTrigger ref={triggerRef}>
               <Button
                  size={"clear"}
                  className={`h-[36px] w-[36px] justify-center rounded-full mt-2`}
               >
                  <Bars3Icon className="w-6" />
               </Button>
            </PopupTrigger>

            <PopupContent origin="top right">
               <MenuContentWrapper className="w-[140px]">
                  <VertialMenuWrapper>
                     <button onClick={() => openModal("lyric")}>
                        <PencilIcon />

                        <span>Edit lyric</span>
                     </button>

                     <button onClick={() => openModal("sync")}>
                        <ArrowPathIcon />

                        <span>Sync lyric</span>
                     </button>

                     <label
                        className="flex cursor-pointer items-center space-x-2"
                        htmlFor="import_lyric"
                     >
                        <ArrowDownTrayIcon />
                        <span>Import</span>
                     </label>

                     <button onClick={() => openModal("export")}>
                        <ArrowTopRightOnSquareIcon />
                        <span>Export</span>
                     </button>
                  </VertialMenuWrapper>
               </MenuContentWrapper>
            </PopupContent>
         </Popup>

         <Modal ref={modalRef}>{renderModal()}</Modal>
      </>
   );
}
