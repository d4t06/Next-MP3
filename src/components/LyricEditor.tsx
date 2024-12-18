"use client";

import { useRef } from "react";
import LyricEditorControl, {
   LyricEditorControlRef,
} from "./LyricEditorControl";
import LyricEditorList from "./LyricEditorList";
import Button from "@/share/_components/Button";
import useLyricEditor from "@/hooks/useLyricEditor";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";
import { ModalRef } from "@/hooks/useModal";

type Props = {
   songWithLyric: SongWithLyric;
};

export default function LyricEditor({ songWithLyric }: Props) {
   const controlRef = useRef<LyricEditorControlRef>(null);

   const modalRef = useRef<ModalRef>(null);

   const closeModal = () => modalRef.current?.close();

   const {
      audioRef,
      isChanged,
      isFetching,
      handleAddLyric,
      restoreTempLyricInStore,
   } = useLyricEditor({
      songWithLyric,
      controlRef,
      modalRef,
   });

   return (
      <>
         <div className="flex flex-col h-full">
            <audio
               className="hidden"
               ref={audioRef}
               src={songWithLyric.song_url}
            ></audio>

            {/* <div className="flex flex-col items-start mt-5 text-amber-800">
         </div> */}
            <Button
               size={"clear"}
               className="self-start py-1 px-2 space-x-1 mt-5"
               href="/dashboard"
            >
               <ChevronLeftIcon className="w-5" />
               <span>Dashboard</span>
            </Button>
            <h1 className="text-xl mt-5 text-amber-800">
               Edit lyric - {songWithLyric.name}
            </h1>

            {audioRef.current && (
               <>
                  <div className="mt-5">
                     <LyricEditorControl
                        ref={controlRef}
                        audioEle={audioRef.current}
                     />
                  </div>

                  <LyricEditorList controlRef={controlRef} />

                  <Button
                     className="self-start mb-5"
                     disabled={!isChanged}
                     onClick={handleAddLyric}
                     loading={isFetching}
                     colors={"second"}
                  >
                     Save
                  </Button>
               </>
            )}
         </div>

         <Modal ref={modalRef}>
            <ConfirmModal
               callback={restoreTempLyricInStore}
               closeModal={closeModal}
               desc="System had found"
               loading={false}
            />
         </Modal>
      </>
   );
}
