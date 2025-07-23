import { Button, ModalContentWrapper, ModalHeader } from "@/share/_components";
import useChangeSongFile from "../_hooks/useChangeSongFile";
import { ChangeEvent, useMemo } from "react";
import LoadingOverlay from "@/share/_components/LoadingOverlay";

type Props = {
   closeModal: () => void;
};

export default function ChangeSongFileModal({ closeModal }: Props) {
   const { songFile, setSongFile, isFetching, submit } = useChangeSongFile({closeModal});

   const songUrl = useMemo(
      () => (songFile ? URL.createObjectURL(songFile) : ""),
      [songFile],
   );

   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) setSongFile(e.target.files[0]);
   };

   return (
      <>
         <ModalContentWrapper>
            <ModalHeader title="Sync lyric" close={closeModal} />

            {!songFile && (
               <input accept="audio" type="file" onChange={handleInputChange} />
            )}

            {songFile && <audio src={songUrl} controls />}

            <Button className="mt-5" onClick={submit}>
               Save
            </Button>

            {isFetching && <LoadingOverlay />}
         </ModalContentWrapper>
      </>
   );
}
