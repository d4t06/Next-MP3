import { RefObject, useEffect, useRef } from "react";

type Props = {
   textRef: RefObject<HTMLDivElement>;
   textWrapperRef: RefObject<HTMLDivElement>;
   content: string;
};

export default function useScrollText({
   textRef,
   textWrapperRef,
   content,
}: Props) {
   const autoScrollTimerId = useRef<NodeJS.Timeout>();
   const unScrollTimerId = useRef<NodeJS.Timeout>();

   const isOverflow = useRef(false); // prevent unNecessary method call

   // const ranReset = useRef(false); // prevent unNecessary method call

   const duration = useRef(0);
   const distance = useRef(0);

   const unScroll = () => {
      if (!textRef.current) return;

      textRef.current.style.transition = `none`;
      textRef.current.style.transform = `translateX(0)`;
   };

   const scroll = () => {
      if (!textRef.current) return;

      textRef.current.style.transition = `transform linear ${duration.current}s`;
      textRef.current.style.transform = `translateX(-${distance.current}px)`;

      unScrollTimerId.current = setTimeout(unScroll, duration.current * 1000);
   };

   const calc = () => {
      if (!textRef.current || !textWrapperRef.current) return;

      distance.current = textRef.current.offsetWidth + 28;
      duration.current = Math.ceil(distance.current / 35);
   };

   const handleReset = () => {
      if (!isOverflow.current || !textRef.current || !textWrapperRef.current)
         return;

      duration.current = 0;
      distance.current = 0;
      isOverflow.current = false;

      clearInterval(autoScrollTimerId.current);
      clearTimeout(unScrollTimerId.current);

      textWrapperRef.current.classList.remove("mask");

      unScroll();
   };

   const handleScroll = () => {
      if (!textRef.current || !textWrapperRef.current || !content) return;

      const isOverF =
         textRef.current.offsetWidth > textWrapperRef.current.offsetWidth;
      if (!isOverF) return;

      isOverflow.current = true;

      textWrapperRef.current.classList.add("mask");

      calc();

      textRef.current.innerHTML =
         textRef.current.innerText +
         "&nbsp; &nbsp; &nbsp;" +
         textRef.current.innerText;

      setTimeout(scroll, 1000);

      autoScrollTimerId.current = setInterval(
         scroll,
         duration.current * 1000 + 3000
      );
   };

   useEffect(() => {
      handleScroll();

      return handleReset;
   }, [content]);
}
