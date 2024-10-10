"use client";

import Button from "@/share/_components/Button";
import { PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import {
   DocumentTextIcon,
   PencilIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import { ElementRef, MouseEventHandler, useRef, useState } from "react";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";
import useSongItemAction from "@/hooks/useSongItemAction";
import EditSongModal from "./EditSongModal";
import { ModalRef } from "@/hooks/useModal";

type Props = {
   song: Song;
};

type Modal = "delete" | "edit";

export default function DashboardSongItemCta({ song }: Props) {
   const [isPlay, setIsPlay] = useState(false);
   const [modal, setModal] = useState<Modal | "">("");

   const playPauseBtnRef = useRef<ElementRef<"button">>(null);
   const modalRef = useRef<ModalRef>(null);

   const audioRef = useRef<ElementRef<"audio">>(null);

   const { action, isFetching } = useSongItemAction();

   const toggle = () => modalRef.current?.toggle();

   const openModal = (modal: Modal) => {
      setModal(modal);
      toggle();
   };
   const handlePlayPause: MouseEventHandler = (e) => {
      const newIsPlay = !isPlay;

      setIsPlay(newIsPlay);

      if (newIsPlay) {
         const previewPlayingBtn = document.querySelector(
            "button.current-playing"
         ) as HTMLButtonElement;
         if (previewPlayingBtn) previewPlayingBtn.click();

         audioRef.current?.play();
      } else {
         audioRef.current?.pause();
      }

      playPauseBtnRef.current?.classList.toggle("current-playing", newIsPlay);
   };

   const classes = {
      button: "space-x-1 px-2 py-1",
      text: "hidden sm:block",
   };

   const handleDeleteSong = async () => {
      await action({ variant: "delete", song });
      toggle();
   };

   const handleEditSong = async (schema: Partial<SongSchema>) => {
      await action({ variant: "edit", id: song.id, song: schema });
      toggle();
   };

   return (
      <>
         <div className="space-x-2 flex-shrink-0 text-right">
            <audio
               ref={audioRef}
               src={song.song_url}
               className="hidden"
            ></audio>
            <Button
               onClick={handlePlayPause}
               className={classes.button}
               ref={playPauseBtnRef}
               size={"clear"}
            >
               {isPlay ? (
                  <PauseIcon className="w-6" />
               ) : (
                  <PlayIcon className="w-6" />
               )}
            </Button>

            <Button
               onClick={() => openModal("delete")}
               className={classes.button}
               size={"clear"}
            >
               <TrashIcon className="w-6" />
               <span className={classes.text}>Delete</span>
            </Button>

            <Button
               onClick={() => openModal("edit")}
               className={classes.button}
               size={"clear"}
            >
               <PencilIcon className="w-6" />
               <span className={classes.text}>Edit</span>
            </Button>

            <Button
               href={`dashboard/edit-lyric/${song.id}`}
               onClick={() => openModal("edit")}
               className={classes.button}
               size={"clear"}
            >
               <DocumentTextIcon className="w-6" />
               <span className={classes.text}>Lyric</span>
            </Button>
         </div>

         <Modal ref={modalRef}>
            {modal === "delete" && (
               <ConfirmModal
                  label={`Delete '${song.name}' ?`}
                  closeModal={toggle}
                  callback={handleDeleteSong}
                  loading={isFetching}
               />
            )}

            {modal === "edit" && (
               <EditSongModal
                  closeModal={toggle}
                  loading={isFetching}
                  song={song}
                  submit={handleEditSong}
               />
            )}
         </Modal>
      </>
   );
}
