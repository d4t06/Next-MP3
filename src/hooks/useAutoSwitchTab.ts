import { ElementRef, RefObject, useEffect, useRef, useState } from "react";

type Props = {
   back: () => void;
   scrollContainer: RefObject<ElementRef<"div">>;
   tab: Tab;
};

export default function useAutoSwitchTab({ back, scrollContainer, tab }: Props) {
   const timerId = useRef<NodeJS.Timeout>();

   const [someThingToTrigger, setSomeThingToTrigger] = useState(0);

   const handleWheel = () => setSomeThingToTrigger(Math.random);

   useEffect(() => {
      const ele = scrollContainer.current;
      if (!ele) return;

      ele.addEventListener("wheel", handleWheel);

      return () => {
         ele.removeEventListener("wheel", handleWheel);
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
