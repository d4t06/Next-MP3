import { store } from "@/firebase";
import {
   deleteObject,
   getDownloadURL,
   ref,
   uploadBytes,
} from "firebase/storage";
import { convertToEn } from "../utils/appHelper";

export const uploadFile = async ({
   file,
   msg,
}: {
   file: File;
   msg?: string;
}) => {
   const start = Date.now();

   // define ref
   const fileRef = ref(store, `test/${convertToEn(file.name)}_${Date.now()}`);

   const fileRes = await uploadBytes(fileRef, file);
   const fileURL = await getDownloadURL(fileRes.ref);

   console.log(">>> upload file finished after", (Date.now() - start) / 1000);

   return { fileURL, filePath: fileRes.metadata.fullPath };
};

export const deleteFile = async ({
   filePath,
   msg,
}: {
   filePath: string;
   msg?: string;
}) => {
   console.log(msg ?? ">>> api: delete file");

   const fileRef = ref(store, filePath);
   await deleteObject(fileRef);
};
