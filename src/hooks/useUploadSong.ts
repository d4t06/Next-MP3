import { ChangeEvent } from "react";

const IMAGE_URL = "/images";

export default function useUploadImage() {
   // hooks
   //    const { setTempImages, addImage } = useImage();
   //    const { setErrorToast, setSuccessToast } = useToast();

   //    const privateRequest = usePrivateRequest();

   const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
      try {
         const inputEle = e.target as HTMLInputElement & { files: FileList };
         const fileLists = inputEle.files;

         // init tempImage
         //  const processImageList: ImageType[] = [];
         //  const fileNeedToUploadIndexes: number[] = [];

         //  const checkDuplicateImage = (ob: ImageType) => {
         //     return processImageList.some(
         //        (image) => image.name === ob.name && image.size == ob.size
         //     );
         //  };

         //firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/test%2Fhuudat01234560_creepextended-gamperdadoni-8177347(mp3cut.net).mp3 ?alt=media

         //  let i = 0;
         https: for (const file of fileLists) {
            console.log("check file", file);

            const formData = new FormData();
            formData.append("file", file);

            await fetch("http://localhost:4000/api/songs", {
               method: "POST",
               body: formData,
            });
         }
         //  for (const file of fileLists) {
         //     const imageObject: ImageType = initImageObject({
         //        name: generateId(file.name),
         //        image_url: URL.createObjectURL(file),
         //        size: file.size,
         //     });

         //     if (checkDuplicateImage(imageObject)) {
         //        URL.revokeObjectURL(imageObject.image_url);

         //        i++;
         //        continue;
         //     }

         //     processImageList.push(imageObject);
         //     fileNeedToUploadIndexes.push(i);

         //     Object.assign(file, {
         //        for_image_index: processImageList.length - 1,
         //     });

         //     i++;
         //  }

         //  setTempImages(processImageList);

         //  for (const val of fileLists) {
         //     const file = fileLists[val] as File & { for_image_index: number };

         //     const formData = new FormData();
         //     formData.append("image", file);

         //     const controller = new AbortController();

         //     const res = await fetch(IMAGE_URL, formData, {
         //        headers: { "Content-Type": "multipart/form-data" },
         //        signal: controller.signal,
         //     });

         //     const newImage = res.data as ImageType;
         //     processImageList.pop();

         //     setTempImages([...processImageList]);
         //     addImage(newImage);
         //  }
         //  setSuccessToast("Upload images successful");
      } catch (error) {
         console.log(error);
         //  setErrorToast("Upload images failed");
         //  setTempImages([]);
      }
   };

   return { handleInputChange };
}
