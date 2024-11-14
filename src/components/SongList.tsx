"use client";

import useAutoSwitchTab from "@/hooks/useAutoSwitchTab";
import { ElementRef, useRef } from "react";
import SongItem from "./SongItem";
import useSongListEvent from "@/hooks/useSongListEvent";

type Props = {
   songs: Song[];
};

export default function SongList({ songs }: Props) {
   const songListContainer = useRef<ElementRef<"div">>(null);

   useSongListEvent({ songListContainer });

   useAutoSwitchTab({ songListContainer });

   return (
      <div
         ref={songListContainer}
         className="max-h-[40vh] overflow-auto no-scrollbar"
      >
         {songs.map((s, i) => (
            <SongItem key={i} song={s} index={i} />
         ))}
      </div>
   );
}
