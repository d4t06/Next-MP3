"use client";

import useAutoSwitchTab from "@/hooks/useAutoSwitchTab";
import { ElementRef, RefObject, useEffect, useRef } from "react";
import SongItem from "./SongItem";

type Props = {
   songs: Song[];
   back: () => void;
   tab: Tab;
   queueButtonRef: RefObject<ElementRef<"button">>;
};

export default function SongList({ back, songs, tab, queueButtonRef }: Props) {
   const songListContainer = useRef<ElementRef<"div">>(null);

   useAutoSwitchTab({
      back,
      scrollContainer: songListContainer,
      tab,
   });

   useEffect(() => {
      const handleWindowClick: EventListener = (e) => {
         if (
            !queueButtonRef ||
            !songListContainer ||
            songListContainer.current?.contains(e.target as Node) ||
            queueButtonRef.current?.contains(e.target as Node)
         )
            return;

         back();
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
