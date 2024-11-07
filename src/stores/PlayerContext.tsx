"use client";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

const usePlayer = (songs: Song[]) => {
   const currentSongRef = useRef<Song | null>(null);
   const [currentIndex, setCurrentIndex] = useState<number | null>(null);

   const setCurrentSong = (index: number) => {
      setCurrentIndex(index);
      currentSongRef.current = songs[index];
   };

   return { songs, currentSongRef, setCurrentSong, currentIndex };
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
