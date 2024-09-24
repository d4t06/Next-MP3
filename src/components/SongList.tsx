"use client";

import useAutoSwitchTab from "@/hooks/useAutoSwitchTab";
import { ElementRef, RefObject, useEffect, useRef } from "react";
import SongItem from "./SongItem";

type Props = {
   songs: Song[];
   back: () => void;
   tab: Tab;
};

export default function SongList({ back, songs, tab }: Props) {
   const songListContainer = useRef<ElementRef<"div">>(null);

   useAutoSwitchTab({
      back,
      scrollContainer: songListContainer,
      tab,
   });

   // handle click outside
   useEffect(() => {
      const handleWindowClick: EventListener = (e) => {
         const queueBtn = document.querySelector(".queue-btn");
         const volumeBtn = document.querySelector(".volume-btn-wrapper");
         const timerBtn = document.querySelector(".timer-btn");

         if (
            !songListContainer ||
            songListContainer.current?.contains(e.target as Node) ||
            queueBtn?.contains(e.target as Node) ||
            volumeBtn?.contains(e.target as Node) ||
            timerBtn?.contains(e.target as Node)
         )
            return;

         // back();
      };

      if (tab !== "queue") return;

      window.addEventListener("click", handleWindowClick);

      return () => {
         window.removeEventListener("click", handleWindowClick);
      };
   }, [tab]);

   return (
      <div
         ref={songListContainer}
         className="max-h-[40vh] overflow-auto no-scrollbar"
      >
         {songs.map((s, i) => (
            <SongItem key={i} song={s} index={i} songs={songs} />
         ))}
      </div>
   );
}
