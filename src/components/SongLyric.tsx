import useSongLyric from "@/hooks/useSongLyric";
import LyricIitem, { LyricStatus } from "./LyricIitem";
import { Center } from "@/share/_components/Center";

type Props = {
   lyrics: Lyric[];
};

export default function SongLyric({ lyrics }: Props) {


   const {currentLyricIndex, lyricRefs} = useSongLyric({lyrics})


   return (
      <>
         {lyrics?.length ? (
            <>
               {lyrics.map((l, index) => {
                  let status: LyricStatus = "coming";

                  if (index < currentLyricIndex) status = "done";
                  if (index === currentLyricIndex) status = "active";
                  return (
                     <LyricIitem
                        key={index}
                        className="pb-4"
                        text={l.text}
                        status={status}
                        ref={(el) => (lyricRefs.current[index] = el!)}
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
