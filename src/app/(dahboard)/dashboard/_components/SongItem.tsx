import { convertToEn } from "@/share/utils/appHelper";
import SongItemCta from "./SongItemCta";

type Props = {
   song: Song;
};

export default function DashboardSongItem({ song }: Props) {
   return (
      <div
         data-first_letter={convertToEn(song.name.charAt(0))}
         className="flex justify-between items-center py-2 text-amber-800 border-b border-b-amber-800/15"
      >
         <div className="">
            <h5 className="overflow-ellipsis text-lg">{song.name}</h5>
            <p className="">{song.singer}</p>
         </div>

         <SongItemCta song={song} />
      </div>
   );
}
