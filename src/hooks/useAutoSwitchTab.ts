import { ElementRef, RefObject, useEffect, useRef, useState } from "react";

type Props = {
   back: () => void;
   scrollContainer: RefObject<ElementRef<"div">>;
   tab: Tab;
};

export default function useAutoSwitchTab({
   back,
   scrollContainer,
   tab,
}: Props) {
   const timerId = useRef<NodeJS.Timeout>();

   const [someThingToTrigger, setSomeThingToTrigger] = useState(0);

   const handleScroll = () => setSomeThingToTrigger(Math.random);

   useEffect(() => {
      const ele = scrollContainer.current;
      if (!ele) return;

      /** must use scroll event cause' wheel event don't work on mobile */
      ele.addEventListener("scroll", handleScroll);

      return () => {
         ele.removeEventListener("scroll", handleScroll);
      };
   }, []);

   useEffect(() => {
      if (!someThingToTrigger) return;

      timerId.current = setTimeout(back, 5000);

      return () => {
         clearTimeout(timerId.current);
      };
   }, [someThingToTrigger]);

   useEffect(() => {
      setSomeThingToTrigger(Math.random);
   }, [tab]);
}
