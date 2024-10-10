import { API_ENDPOINT, sleep } from "../utils/appHelper";

export const getSongLyric = async (songId: number) => {
   const res = await fetch(`${API_ENDPOINT}/song-lyrics?song_id=${songId}`, {
      next: { tags: [`lyric-${songId}`] },
   });

   if (!res.ok) return undefined;

   if (process.env.NODE_ENV === "development") await sleep(500);

   const payload = (await res.json()) as {
      data: SongLyric;
   };
   return payload.data;
};
