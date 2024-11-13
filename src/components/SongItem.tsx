import { formatTime } from "@/share/utils/appHelper";
import SongItemWrapper from "./SongItemWrapper";

type Props = {
   song: Song;
   index: number;
};

export default function SongItem({ song, index }: Props) {
   return (
      <SongItemWrapper song={song} index={index}>
         <div className="">
            <h5 className="">{song.name}</h5>
            <p className=" text-sm">{song.singer}</p>
         </div>
         <span className="">{formatTime(song.duration)}</span>
      </SongItemWrapper>
   );
}
