import { usePlayerContext } from "@/stores/PlayerContext";
import { RefObject, useEffect } from "react";

type Props = {
   songListContainer: RefObject<HTMLDivElement>;
};

export default function useSongListEvent({ songListContainer }: Props) {
   const { tab, setTab } = usePlayerContext();

   const handleWindowClick: EventListener = (e) => {
      const $ = document.querySelector.bind(document);

      const buttons = [
         $(".queue-btn"),
         $(".volume-btn-wrapper"),
         $(".timer-btn"),
      ];
      const target = e.target as Node;

      if (
         !songListContainer ||
         songListContainer.current?.contains(target) ||
         !!buttons.find((btn) => btn?.contains(target))
      )
         return;

      setTab("playing");
   };

   useEffect(() => {
      if (tab !== "queue") return;
      window.addEventListener("click", handleWindowClick);

      return () => {
         window.removeEventListener("click", handleWindowClick);
      };
   }, [tab]);
}
