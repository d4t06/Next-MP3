import { Button, ModalContentWrapper, ModalHeader } from "@/share/_components";
import { getLocalStorage } from "@/share/utils/appHelper";
import { useRef } from "react";
import { useEditLyricContext } from "./EditLyricContext";

type Props = {
   closeModal: () => void;
};

export default function SyncLyricModal({ closeModal }: Props) {
   const { lyrics, setLyrics, setIsChanged } = useEditLyricContext();

   const inputRef = useRef<HTMLInputElement>(null);

   const handleSyncLyric = () => {
      const time = +(inputRef.current?.value || "");
      if (!time) return;

      const currentLyricIndex = +getLocalStorage()["edit_current-lyric-index"];
      if (!isNaN(currentLyricIndex)) {
         const newLyrics = [...lyrics];

         if (time < 0) {
            const isOverDownSync = lyrics[0].end + time < 0;
            if (isOverDownSync) return;
         }

         newLyrics.forEach((_item, index) => {
            if (index >= currentLyricIndex) {
               newLyrics[index].start = +(newLyrics[index].start + time).toFixed(1);
               newLyrics[index].end = +(newLyrics[index].end + time).toFixed(1);
            }
         });

         setLyrics(newLyrics);

         setIsChanged(true);

         closeModal();
      }
   };

   return (
      <ModalContentWrapper>
         <ModalHeader title="Sync lyric" close={closeModal} />

         <input ref={inputRef} type="number" className="my-input text-xl" />

         <Button className="mt-5" onClick={handleSyncLyric}>Save</Button>
      </ModalContentWrapper>
   );
}
