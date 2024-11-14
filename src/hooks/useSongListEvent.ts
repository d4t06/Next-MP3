import { usePlayerContext } from "@/stores/PlayerContext";
import { RefObject, useEffect } from "react";

type Props = {
   songListContainer: RefObject<HTMLDivElement>;
};

export default function useSongListEvent({ songListContainer }: Props) {
   const { tab, setTab } = usePlayerContext();

   const scroll = (el: Element) => {
      el.scrollIntoView({
         behavior: "instant",
         block: "center",
      });
   };

   const handleKeyboardPress = (e: KeyboardEvent) => {
      const isLetterOrNumber = /^[a-zA-Z0-9]$/;
      if (isLetterOrNumber.test(e.key)) {
         const firstElement = document.querySelector(
            `div[date-first-letter=${
               typeof e.key === "number" ? e.key : "'" + e.key + "'"
            }]`
         );

         if (firstElement) scroll(firstElement);
      }
   };

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

      const activeSongEle = document.querySelector(".active-song-item");
      if (activeSongEle) scroll(activeSongEle);

      window.addEventListener("keypress", handleKeyboardPress);
      window.addEventListener("click", handleWindowClick);

      return () => {
         window.removeEventListener("keypress", handleKeyboardPress);
         window.removeEventListener("click", handleWindowClick);
      };
   }, [tab]);
}
