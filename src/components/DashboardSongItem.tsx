import DashboardSongItemCta from "./DashboardSongItemCta";

type Props = {
   song: Song;
};

export default function DashboardSongItem({ song }: Props) {
   return (
      <div className="flex justify-between items-center py-2 text-amber-800 border-b border-b-amber-800/15">
         <div className="">
            <h5 className="overflow-ellipsis text-lg">{song.name}</h5>
            <p className="">{song.singer}</p>
         </div>

         <DashboardSongItemCta song={song} />
      </div>
   );
}
