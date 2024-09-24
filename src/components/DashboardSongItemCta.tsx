"use client";

import Button from "@/share/_components/Button";
import { PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ElementRef, useRef, useState } from "react";
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

   const modalRef = useRef<ModalRef>(null);

   const audioRef = useRef<ElementRef<"audio">>(null);

   const { action, isFetching } = useSongItemAction();

   const closeModal = () => modalRef.current?.toggle();

   const handlePlayPause = () => {
      const newIsPlay = !isPlay;

      setIsPlay(newIsPlay);
      newIsPlay ? audioRef.current?.play() : audioRef.current?.pause();
   };

   const classes = {
      button: "space-x-1 px-2 py-1",
      text: "hidden sm:block",
   };

   const handleDeleteSong = async () => {
      await action({ variant: "delete", song });
      closeModal();
   };

   const handleEditSong = async (schema: Partial<SongSchema>) => {
      await action({ variant: "edit", id: song.id, song: schema });
      closeModal();
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
               size={"clear"}
            >
               {isPlay ? (
                  <PauseIcon className="w-6" />
               ) : (
                  <PlayIcon className="w-6" />
               )}
            </Button>

            <Button
               onClick={() => setModal("delete")}
               className={classes.button}
               size={"clear"}
            >
               <TrashIcon className="w-6" />
               <span className={classes.text}>Delete</span>
            </Button>

            <Button
               onClick={() => setModal("edit")}
               className={classes.button}
               size={"clear"}
            >
               <PencilIcon className="w-6" />
               <span className={classes.text}>Edit</span>
            </Button>
         </div>

         <Modal>
            {modal === "delete" && (
               <ConfirmModal
                  label={`Delete '${song.name}' ?`}
                  closeModal={closeModal}
                  callback={handleDeleteSong}
                  loading={isFetching}
               />
            )}

            {modal === "edit" && (
               <EditSongModal
                  closeModal={closeModal}
                  loading={isFetching}
                  song={song}
                  submit={handleEditSong}
               />
            )}
         </Modal>
      </>
   );
}
