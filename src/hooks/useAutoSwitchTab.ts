import { usePlayerContext } from "@/stores/PlayerContext";
import { ElementRef, RefObject, useEffect, useRef, useState } from "react";

type Props = {
   songListContainer: RefObject<ElementRef<"div">>;
};

export default function useAutoSwitchTab({ songListContainer }: Props) {
   const { tab, setTab } = usePlayerContext();

   const timerId = useRef<NodeJS.Timeout>();

   const [someThingToTrigger, setSomeThingToTrigger] = useState(0);

   const handleScroll = () => setSomeThingToTrigger(Math.random);

   useEffect(() => {
      const ele = songListContainer.current;
      if (!ele) return;

      /** must use scroll event cause' wheel event don't work on mobile */
      ele.addEventListener("scroll", handleScroll);

      return () => {
         ele.removeEventListener("scroll", handleScroll);
      };
   }, []);

   useEffect(() => {
      if (!someThingToTrigger) return;

      if (tab === "queue")
         timerId.current = setTimeout(() => setTab("playing"), 5000);

      return () => {
         clearTimeout(timerId.current);
      };
   }, [someThingToTrigger]);

   useEffect(() => {
      setSomeThingToTrigger(Math.random);
   }, [tab]);
}
