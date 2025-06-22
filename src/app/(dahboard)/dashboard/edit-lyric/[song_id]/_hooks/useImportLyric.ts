import { ChangeEventHandler } from "react";
import { useToast } from "@/stores/toastContext";
import { converSrt } from "./convertSrt";
import { useEditLyricContext } from "../_components/EditLyricContext";

export default function useImportLyric() {
   const { setErrorToast } = useToast();
   const { setLyrics, setIsChanged, setIsPreview } = useEditLyricContext();

   const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!e.target.files) return;

      const file = e.target.files[0];

      const acceptFileExtension = ["json", "srt"];

      const fileExtension = file.name.split(".")[file.name.split(".").length - 1];
      const reader = new FileReader();

      reader.onload = (_e) => {
         try {
            if (!_e.target?.result || typeof _e.target.result !== "string")
               return;

            // json format
            if (fileExtension === "json") {
               const lyrics = JSON.parse(
                  (_e.target?.result as string | undefined) || "[]",
               );

               setLyrics(lyrics);
               // srt format
            } else {
               const lyrics = converSrt(_e.target.result);
               setLyrics(lyrics);
            }

            setIsChanged(true);
            setIsPreview(true);
         } catch (error: any) {
            console.log(error);
            setErrorToast(error.message || "");
         } finally {
            e.target.value = "";
         }
      };

      if (acceptFileExtension.includes(fileExtension)) {
         reader.readAsText(file);
      } else {
         setErrorToast("File not supported");
         e.target.value = "";
      }
   };

   return { handleInputChange };
}
