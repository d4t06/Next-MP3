"use client";
import {
   createContext,
   ElementRef,
   ReactNode,
   useContext,
   useRef,
   useState,
} from "react";

const usePlayer = (songs: Song[]) => {
   const [currentIndex, setCurrentIndex] = useState<number | null>(null);
   const [tab, setTab] = useState<Tab>("playing");

   const currentSongRef = useRef<Song | null>(null);
   const audioEleRef = useRef<ElementRef<"audio">>(null);

   const setCurrentSong = (index: number) => {
      setCurrentIndex(index);
      currentSongRef.current = songs[index];
   };

   return {
      songs,
      audioEleRef,
      currentSongRef,
      setCurrentSong,
      currentIndex,
      tab,
      setTab,
   };
};

type ContextType = ReturnType<typeof usePlayer>;

const Context = createContext<ContextType | null>(null);

export default function PlayerProvider({
   children,
   songs,
}: {
   children: ReactNode;
   songs: Song[];
}) {
   return (
      <Context.Provider value={usePlayer(songs)}>{children}</Context.Provider>
   );
}

export function usePlayerContext() {
   const context = useContext(Context);

   if (!context) throw new Error("");

   return context;
}
