"use client";

import { Button, Modal, ConfirmModal, ModalRef } from "@/share/_components";
import { PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import {
   ArrowDownTrayIcon,
   Bars3Icon,
   DocumentTextIcon,
   PencilIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import { ElementRef, MouseEventHandler, useRef, useState } from "react";
import useSongItemAction from "@/hooks/useSongItemAction";
import {
   MenuContentWrapper,
   Popup,
   PopupContent,
   PopupTrigger,
   VertialMenuWrapper,
} from "@/share/_components";
import Link from "next/link";
import EditSongModal from "./EditSongModal";

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
            "button.current-playing",
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

   const download = () => {
      const a = document.createElement("a");
      a.href = song.song_url;
      a.target = "_blank";
      a.href = song.song_url;
      a.click();
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

            <Popup appendOnPortal>
               <PopupTrigger>
                  <Button size={"clear"} className={classes.button}>
                     <Bars3Icon className="w-6" />
                     <span className={classes.text}>Menu</span>
                  </Button>
               </PopupTrigger>

               <PopupContent spacer={10}>
                  <MenuContentWrapper className="w-[140px]">
                     <VertialMenuWrapper>
                        <button onClick={() => openModal("edit")}>
                           <PencilIcon />
                           <span>Edit</span>
                        </button>
                        <Link href={`dashboard/edit-lyric/${song.id}`}>
                           <DocumentTextIcon />
                           <span>Lyric</span>
                        </Link>

                        <button onClick={download}>
                           <ArrowDownTrayIcon />
                           <span>Download</span>
                        </button>
                        <button onClick={() => openModal("delete")}>
                           <TrashIcon />
                           <span>Delete</span>
                        </button>
                     </VertialMenuWrapper>
                  </MenuContentWrapper>
               </PopupContent>
            </Popup>
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
