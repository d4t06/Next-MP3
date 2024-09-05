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

type SongSchema = Omit<Song, "id">;

type Playlist = {
   blurhash_encode: string;
   image_url: string;
   song_ids: string[];
   id: string;
   by: string;
   name: string;
};

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
