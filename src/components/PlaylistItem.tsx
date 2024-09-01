import SquareBox from "@/share/_components/SquareBox";
import Image from "next/image";

type Props = {
   playlist: Playlist;
};

export default function PlaylistItem({ playlist }: Props) {
   return (
      <>
         <SquareBox>
            <Image
               width={150}
               height={150}
               className="w-full"
               src={playlist.image_url}
               alt=""
            />
         </SquareBox>
         <h5 className="font-medium mt-1">{playlist.name}</h5>
      </>
   );
}
