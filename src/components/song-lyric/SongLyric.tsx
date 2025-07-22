import useSongLyric from "./useSongLyric";
import LyricItem, { LyricStatus } from "./LyricItem";
import { Center } from "@/share/_components";
import { usePlayerContext } from "@/stores/PlayerContext";
import { useEffect } from "react";

type Props = {
   lyrics: Lyric[];
};

export default function SongLyric({ lyrics }: Props) {
   const { audioEleRef, tab, currentIndex: currentSongIndex } = usePlayerContext();

   if (!audioEleRef.current) return <></>;

   const { currentIndex, lyricRefs, reset } = useSongLyric({
      lyrics,
      audioEle: audioEleRef.current,
      isActive: tab === "lyric",
   });


   useEffect(() => {

      return () => {
         reset();
      }
   }, [currentSongIndex])

   return (
      <>
         {lyrics?.length ? (
            <>
               {lyrics.map((l, index) => {
                  let status: LyricStatus = "coming";

                  if (index < currentIndex) status = "done";
                  if (index === currentIndex) status = "active";
                  return (
                     <LyricItem
                        key={index}
                        className="pb-4"
                        text={l.text}
                        status={status}
                        getPRef={(el) => (lyricRefs.current[index] = el!)}
                     />
                  );
               })}
            </>
         ) : (
            <Center>
               <p>...</p>
            </Center>
         )}
      </>
   );
}
