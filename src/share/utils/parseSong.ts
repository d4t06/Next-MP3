import { parseBlob } from "music-metadata";

type ParserSong = {
   name: string;
   singer: string;
   image: ArrayBuffer | null;
   duration: number;
};
export default async function parseSongFromFile(songFile: File) {
   const result = await parseBlob(songFile);
   if (!result) throw new Error('');

   const {
      common: { title, artist },
      format: { duration },
   } = result;

   const data: ParserSong = { name: "", singer: "", image: null, duration: 0 };

   data.name = title || songFile.name;
   data.singer = artist || "...";
   data.duration = duration || 0;

   return data;
}
