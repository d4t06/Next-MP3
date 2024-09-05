import { sleep } from "../utils/appHelper";

export const getAllSong = async () => {
   const res = await fetch(
      `${
         process.env.NEXT_PUBLIC_API_ENDPOINT ||
         "https://nest-mp3.vercel.app/api"
      }/songs`,
      { next: { tags: ["songs"] } }
   );

   if (!res.ok) return undefined;

   if (process.env.NODE_ENV === "development") await sleep(500);

   const payload = (await res.json()) as {
      data: { songs: Song[]; count: number };
   };
   return payload.data;
};
