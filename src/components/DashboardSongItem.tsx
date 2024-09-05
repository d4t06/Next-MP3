import DashboardSongItemCta from "./DashboardSongItemCta";
import SongItemCheckBtn from "./SongItemCheckBtn";

type Props = {
   song: Song;
};

export default function DashboardSongItem({ song }: Props) {
   return (
      <div className="flex justify-between items-center py-2 text-amber-800 border-b border-b-amber-800/15">
         <div className="flex space-x-2 max-w-[50%]">
            <SongItemCheckBtn song={song} />
            <div className="">
               <h5 className="overflow-ellipsis">{song.name}</h5>
               <p className="text-sm">{song.singer}</p>
            </div>
         </div>

         <DashboardSongItemCta song={song} />
      </div>
   );
}
