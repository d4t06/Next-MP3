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
import { useEditLyricContext } from "./EditLyricContext";
import ChangeSongFileModal from "./ChangeSongFileModal";

type Modal = "lyric" | "tutorial" | "song-file" | "sync" | "export";

type Props = {
   pause: () => void;
};

export default function MenuBtn({ pause }: Props) {
   const { isPreview, lyrics } = useEditLyricContext();
   const [modal, setModal] = useState<Modal | "">("");

   const modalRef = useRef<ModalRef>(null);

   const { handleInputChange } = useImportLyric();

   const closeModal = () => modalRef.current?.close();

   const { exportLyric } = useExportLyric({ closeModal });

   const openModal = (m: Modal) => {
      pause();
      setModal(m);
      modalRef.current?.open();
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
            <PopupTrigger>
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
                     {!isPreview && (
                        <button onClick={() => openModal("lyric")}>
                           <PencilIcon />

                           <span>Edit lyric</span>
                        </button>
                     )}

                     {isPreview && !!lyrics.length && (
                        <button onClick={() => openModal("sync")}>
                           <ArrowPathIcon />

                           <span>Sync lyric</span>
                        </button>
                     )}

                     <button className="!p-0">
                        <label
                           className="flex px-3 py-2 w-full cursor-pointer items-center space-x-2"
                           htmlFor="import_lyric"
                        >
                           <ArrowDownTrayIcon />
                           <span>Import</span>
                        </label>
                     </button>

                     <button onClick={() => openModal("export")}>
                        <ArrowTopRightOnSquareIcon />
                        <span>Export</span>
                     </button>

                     <button onClick={() => openModal("song-file")}>
                        <ArrowPathIcon />
                        <span>Song file</span>
                     </button>
                  </VertialMenuWrapper>
               </MenuContentWrapper>
            </PopupContent>
         </Popup>

         <Modal ref={modalRef}>
            {modal === "lyric" && (
               <EditStringLyicModal closeModal={closeModal} />
            )}

            {modal === "sync" && <SyncLyricModal closeModal={closeModal} />}

            {modal === "export" && (
               <ModalContentWrapper>
                  <ModalHeader title="Export" close={closeModal} />

                  <div className="flex">
                     <Button onClick={() => exportLyric({ type: "json" })}>
                        JSON
                     </Button>
                     <Button
                        className="ml-2"
                        onClick={() => exportLyric({ type: "srt" })}
                     >
                        SRT
                     </Button>
                  </div>
               </ModalContentWrapper>
            )}
            {modal === "song-file" && (
               <ChangeSongFileModal closeModal={closeModal} />
            )}
         </Modal>
      </>
   );
}
