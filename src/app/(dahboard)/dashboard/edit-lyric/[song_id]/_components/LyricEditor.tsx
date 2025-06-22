"use client";

import { useRef } from "react";
import LyricEditorControl, {
   LyricEditorControlRef,
} from "./LyricEditorControl";
import LyricEditorList from "./LyricEditorList";
import Button from "@/share/_components/Button";
import useLyricEditor from "../_hooks/useLyricEditor";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ConfirmModal, Modal, ModalRef } from "@/share/_components";

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

            <div className="flex items-center mt-3">
               <Button
                  size={"clear"}
                  className="self-start py-1 px-2 space-x-1"
                  href="/dashboard"
               >
                  <ChevronLeftIcon className="w-5" />
                  <span>Dashboard</span>
               </Button>
               <h1 className="text-xl ml-5 text-amber-800">
                  Edit lyric - {songWithLyric.name}
               </h1>
            </div>

            {audioRef.current && (
               <>
                  <div className="mt-5">
                     <LyricEditorControl
                        ref={controlRef}
                        audioEle={audioRef.current}
                     />
                  </div>

                  <LyricEditorList audioEle={audioRef.current} controlRef={controlRef} />

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
