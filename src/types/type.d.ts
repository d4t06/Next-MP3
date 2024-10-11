type Song = {
   image_file_path: string;
   song_url: string;
   singer: string;
   size: number;
   song_file_path: string;
   name: string;
   duration: number;
   id: number;
   image_url: string;
};

type Lyric = {
   start: number;
   end: number;
   text: string;
};

type SongLyric = {
   id: number | null;
   song_id: number;
   base_lyric: string;
   lyrics: string;
};

type SongWithLyric = Song & {
   song_lyric: SongLyric | null;
};

type SongSchema = Omit<Song, "id">;

type CurrentSong = {
   song: Song;
   index: number;
   from: "songs" | "playlist";
};

type Toast = {
   title?: "success" | "error" | "warning";
   desc: string;
   id: string;
};

type Tab = "playing" | "queue";
