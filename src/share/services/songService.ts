import { API_ENDPOINT, sleep } from "../utils/appHelper";

export const getAllSong = async () => {
   try {
      const res = await fetch(`${API_ENDPOINT}/songs`, {
         next: { tags: ["songs"] },
      });

      if (!res.ok) return undefined;

      if (process.env.NODE_ENV === "development") await sleep(500);

      const payload = (await res.json()) as {
         data: { songs: Song[]; count: number };
      };
      return payload.data;
   } catch (error) {
      console.log(error);
      return undefined;
   }
};

export const getOneSong = async (songId: string) => {
   if (isNaN(+songId)) return undefined;

   const url = `${API_ENDPOINT}/songs/${songId}`;

   const res = await fetch(url, { next: { tags: [`song-${songId}`] } });

   if (!res.ok) return undefined;

   if (process.env.NODE_ENV === "development") await sleep(500);

   const payload = (await res.json()) as {
      data: SongWithLyric;
   };

   return payload.data;
};
