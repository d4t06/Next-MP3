"use client";

import { convertToEn, setLocalStorage } from "@/share/utils/appHelper";
import { useCurrentSong } from "@/stores/currentSongContext";
import { useQueue } from "@/stores/songQueueContext";
import { ReactNode } from "react";

type Props = {
   song: Song;
   songs: Song[];
   children: ReactNode;
   className?: string;
   index: number;
   songFrom?: "songs";
};

export default function SongItemWrapper({
   children,
   song,
   songs,
   index,
   songFrom = "songs",
}: Props) {
   const { setCurrentSong, currentSong, from } = useCurrentSong();
   const { setQueue, songs: queueSongs } = useQueue();

   const active = currentSong?.id === song.id;

   const handleSetSong = () => {
      if (!active) {
         if (songFrom !== from || songs.length !== queueSongs.length) {
            setQueue(songs);
            setLocalStorage("queue", songs);
         }
         setCurrentSong({ song, index, from: songFrom });
      }
   };

   return (
      <div
         onClick={handleSetSong}
         date-first-letter={convertToEn(song.name.charAt(0))}
         className={`${
            active ? "active-song-item" : ""
         } flex w-full font-medium justify-between items-center rounded-md p-2  ${
            active
               ? "bg-amber-100 text-amber-800"
               : "cursor-pointer text-amber-100 hover:bg-amber-700"
         } `}
      >
         {children}
      </div>
   );
}
