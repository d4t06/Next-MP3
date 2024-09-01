import PlaylistItem from "@/components/PlaylistItem";
import SongItem from "@/components/SongItem";
import { playlists, songs } from "@/data";

export default function HomePage() {
   return (
      <div className="pb-[calc(100px+2.5rem)]">
         <div className="mt-5 space-y-2">
            {songs.map((s, index) => (
               <SongItem key={index} index={index} songs={songs} song={s} />
            ))}
         </div>
      </div>
   );
}
