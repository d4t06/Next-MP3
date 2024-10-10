import useAudioControl from "@/hooks/useAudioControl";
import Button from "@/share/_components/Button";
import { PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import {
   BackwardIcon,
   ExclamationCircleIcon,
   PlusIcon,
   ForwardIcon,
   ArrowPathIcon,
   MinusIcon,
   DocumentTextIcon,
   Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";
import Modal from "./Modal";
import InputModal from "@/share/_components/InputModal";
import { ModalRef } from "@/hooks/useModal";
import { useEditLyricContext } from "@/stores/editLyricContext";
import { useLyricAction } from "@/hooks/useEditLyricAction";

type Props = {
   audioEle: HTMLAudioElement;
};

export type LyricEditorControlRef = {
   seek: (second: number) => void;
   pause: () => void;
};

function LyricEditorControl(
   { audioEle }: Props,
   ref: Ref<LyricEditorControlRef>
) {
   const modalRef = useRef<ModalRef>(null);

   const { setBaseLyric, baseLyric, setIsChanged } = useEditLyricContext();
   const {
      handlePlayPause,
      pause,
      backward,
      forward,
      status,
      seek,
      isClickPlay,
   } = useAudioControl({
      audioEle,
   });

   const { addLyric, removeLyric, isEnableAddBtn } = useLyricAction({
      audioEle,
      isClickPlay,
   });

   useImperativeHandle(ref, () => ({ seek, pause }));

   const closeModal = () => modalRef.current?.toggle();

   const handleSetBaseLyric = (value: string) => {
      setBaseLyric(value);
      setIsChanged(true);
      closeModal();
   };

   const classes = {
      button: "mt-2 ml-2 space-x-1",
      icon: "w-6",
   };

   const renderPlayPausedButton = () => {
      switch (status) {
         case "error":
            return <ExclamationCircleIcon className="w-6" />;
         case "playing":
            return <PauseIcon className="w-6" />;

         case "paused":
            return <PlayIcon className="w-6" />;

         case "waiting":
            return <ArrowPathIcon className="w-6 animate-spin" />;
      }
   };

   return (
      <>
         <div className="flex flex-wrap -mt-2 -ml-2">
            <Button
               colors={"second"}
               className={classes.button}
               onClick={handlePlayPause}
            >
               {renderPlayPausedButton()}
            </Button>
            <Button
               disabled={!isEnableAddBtn}
               onClick={addLyric}
               className={classes.button}
            >
               <PlusIcon className="w-6" />
               <span>Add</span>
            </Button>
            <Button onClick={removeLyric} className={classes.button}>
               <MinusIcon className="w-6" />
               <span>Remove</span>
            </Button>

            <Button onClick={() => backward(2)} className={classes.button}>
               <BackwardIcon className="w-6" />
               <span>2s</span>
            </Button>
            <Button onClick={() => forward(2)} className={classes.button}>
               <span>2s</span>
               <ForwardIcon className="w-6" />
            </Button>
            <Button
               onClick={() => modalRef.current?.toggle()}
               className={classes.button}
            >
               <DocumentTextIcon className="w-6" />
               <span>Edit lyrics</span>
            </Button>

            <Button className={classes.button}>
               <Cog6ToothIcon className="w-6" />
            </Button>
         </div>

         <Modal ref={modalRef}>
            <InputModal
               variant="text-area"
               initValue={baseLyric}
               closeModal={closeModal}
               submit={handleSetBaseLyric}
            />
         </Modal>
      </>
   );
}

export default forwardRef(LyricEditorControl);
