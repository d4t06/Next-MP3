type Song = {
   image_file_path: string;
   song_url: string;
   song_in: string;
   singer: string;
   size: number;
   song_file_path: string;
   name: string;
   blurhash_encode: string;
   duration: number;
   lyric_id: string;
   by: string;
   id: string;
   image_url: string;
};

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
