import OnClickWrapper from "@/share/_components/OnClickWrapper";
import { formatTime } from "@/share/utils/appHelper";
import SongItemWrapper from "./SongItemWrapper";

type Props = {
   song: Song;
   index: number;
   songs: Song[];
};

export default function SongItem({ song, index, songs }: Props) {
   return (
      <SongItemWrapper songs={songs} song={song} index={index}>
         <div className="">
            <h5 className="">{song.name}</h5>
            <p className=" text-sm">{song.singer}</p>
         </div>
         <span className="">{formatTime(song.duration)}</span>
      </SongItemWrapper>
   );
}
