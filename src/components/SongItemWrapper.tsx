"use client";

import { setLocalStorage } from "@/share/utils/appHelper";
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
   className = "",
   index,
   songFrom = "songs",
}: Props) {
   const { setCurrentSong, currentSong, from } = useCurrentSong();
   const { setQueue, songs: queueSongs } = useQueue();

   const handleSetSong = () => {
      if (songFrom !== from || songs.length !== queueSongs.length) {
         setQueue(songs);
         setLocalStorage("queue", songs);
      }
      setCurrentSong({ song, index, from: songFrom });
   };

   return (
      <div className={className} onClick={handleSetSong}>
         <div
            className={`flex w-full font-medium justify-between items-center rounded-md p-2  ${
               currentSong?.id === song.id
                  ? "bg-amber-100 text-amber-800"
                  : "cursor-pointer text-amber-100 hover:bg-amber-700"
            } `}
         >
            {children}
         </div>
      </div>
   );
}
