export const formatTime = (time: number) => {
   const minutes = Math.floor(time / 60);
   const seconds = Math.floor(time % 60);
   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const getLocalStorage = () =>
   typeof window !== "undefined"
      ? (JSON.parse(window.localStorage.getItem("next-mp3") || "{}") as Record<
           string,
           any
        >)
      : {};

export const setLocalStorage = (key: string, value: any) => {
   const storage = getLocalStorage();
   storage[key] = value;

   if (typeof window !== "undefined")
      window.localStorage.setItem("next-mp3", JSON.stringify(storage));
};

export const sleep = (s: number) => new Promise((rs) => setTimeout(rs, s));

export const initSongObject = ({ ...value }: Partial<SongSchema>) => {
   return {
      name: "",
      singer: "",
      image_url: "",
      song_url: "",
      duration: 0,
      image_file_path: "",
      song_file_path: "",
      size: 0,
      ...value,
   } as SongSchema;
};

export const convertToEn = (name: string): string => {
   const convert = (str: string) => {
     const newString = str
       .toLocaleLowerCase()
       .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ắ|ằ|ẳ|ẵ|ặ/g, 'a')
       .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
       .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
       .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o')
       .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
       .replace(/ỳ|ý|ý|ỷ|ỹ/g, 'y')
       .replace(/đ/g, 'd');
     return newString;
   };
   return convert(name).replaceAll(/[\W_]/g, '-');
 };