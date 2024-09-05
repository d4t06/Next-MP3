"use client";

import { useSelectSongContext } from "@/stores/selectSongContext";
import { CheckIcon, StopIcon } from "@heroicons/react/24/outline";

type Props = {
   song: Song;
};

export default function SongItemCheckBtn({ song }: Props) {
   const { selectSong, selectedSongs } = useSelectSongContext();

   const isChecked = selectedSongs.includes(song);

   return (
      <button onClick={() => selectSong(song)}>
         {isChecked ? (
            <CheckIcon className="w-5" />
         ) : (
            <StopIcon className="w-5" />
         )}
      </button>
   );
}
