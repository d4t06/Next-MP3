"use client";

import { convertToEn } from "@/share/utils/appHelper";
import { usePlayerContext } from "@/stores/PlayerContext";
import { ReactNode } from "react";

type Props = {
   song: Song;
   children: ReactNode;
   className?: string;
   index: number;
};

export default function SongItemWrapper({ children, song, index }: Props) {
   const { currentIndex, setCurrentSong } = usePlayerContext();

   const active = currentIndex === index;

   const handleSetSong = () => {
      if (!active) {
         setCurrentSong(index);
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
