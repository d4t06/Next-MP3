"use client";

import useAutoSwitchTab from "@/hooks/useAutoSwitchTab";
import { ElementRef, useRef } from "react";
import SongItem from "./SongItem";
import useSongListEvent from "@/hooks/useSongListEvent";

type Props = {
   songs: Song[];
   back: () => void;
   tab: Tab;
};

export default function SongList({ back, songs, tab }: Props) {
   const songListContainer = useRef<ElementRef<"div">>(null);

   useSongListEvent({ tab, back, songListContainer });

   useAutoSwitchTab({
      back,
      scrollContainer: songListContainer,
      tab,
   });

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
