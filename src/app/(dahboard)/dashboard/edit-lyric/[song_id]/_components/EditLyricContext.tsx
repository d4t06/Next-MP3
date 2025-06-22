"use client";

import { createContext, ReactNode, useContext, useRef, useState } from "react";

const useEditLyric = () => {
   const [song, setSong] = useState<SongWithLyric>();
   const [isPreview, setIsPreview] = useState(false);
   const [baseLyric, setBaseLyric] = useState<string>("");
   const [baseLyricArr, setBaseLyricArr] = useState<string[]>([]);
   const [lyrics, setLyrics] = useState<Lyric[]>([]);
   const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0);
   const [isFetching, setIsFetching] = useState(false);
   const [isChanged, setIsChanged] = useState(false);
   const [songLyricId, setSongLyricId] = useState<number | null>(null);

   const start = useRef(0);

   const updateLyric = (index: number, text: string) => {
      setLyrics((prev) => {
         const target = { ...prev[index], text };
         prev[index] = target;

         return [...prev];
      });
   };

   return {
      song,
      setSong,
      baseLyric,
      songLyricId,
      setSongLyricId,
      setBaseLyric,
      baseLyricArr,
      setBaseLyricArr,
      lyrics,
      setLyrics,
      currentLyricIndex,
      setCurrentLyricIndex,
      updateLyric,
      isFetching,
      setIsFetching,
      isChanged,
      setIsChanged,
      start,
      isPreview,
      setIsPreview,
   };
};

type ContextType = ReturnType<typeof useEditLyric>;

const Context = createContext<ContextType | null>(null);

export default function EditLyricContextProvider({
   children,
}: {
   children: ReactNode;
}) {
   return (
      <Context.Provider value={useEditLyric()}>{children}</Context.Provider>
   );
}

export const useEditLyricContext = () => {
   const context = useContext(Context);

   if (!context) throw new Error("Context not found");
   return context;
};
