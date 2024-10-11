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
import Popup, { PopupContent, PopupTrigger } from "@/share/_components/Popup";

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

   const { setBaseLyric, baseLyric, setIsChanged, lyrics } =
      useEditLyricContext();
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

   const {
      addLyric,
      removeLyric,
      isEnableAddBtn,
      speed,
      volume,
      changeSpeed,
      changeVolume,
   } = useLyricAction({
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
      arrow: `before:content-[''] before:absolute before:-translate-x-1/2 before:left-[27px]  before:bottom-[calc(100%-1px)] before:z-[-1] before:border-8 before:border-transparent before:border-b-amber-800`,

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
            <Popup className="mt-2 ml-2">
               <PopupTrigger>
                  <Button className="h-full" colors={"second"}>
                     <Cog6ToothIcon className="w-6" />
                  </Button>
               </PopupTrigger>

               <PopupContent
                  className="top-[calc(100%+8px)] left-0 z-[9]"
                  appendTo="parent"
               >
                  <div className={`relative ${classes.arrow} w-[220px] relative p-2 rounded-lg text-amber-800 bg-amber-100 border-[2px] border-amber-800`}>
                     <div className="space-y-[6px]">
                        <div className={`flex space-x-1`}>
                           <div className="w-[110px] flex-shrink-0">
                              Speed {speed}x
                           </div>
                           <input
                              className="w-full"
                              type="range"
                              step={0.1}
                              min={1}
                              max={1.5}
                              value={speed}
                              onChange={(e) => changeSpeed(+e.target.value)}
                           />
                        </div>

                        <div className={`flex space-x-1`}>
                           <div className="w-[110px] flex-shrink-0">
                              Volume {volume}%
                           </div>
                           <input
                              className="w-full"
                              type="range"
                              step={1}
                              min={1}
                              max={100}
                              value={volume}
                              onChange={(e) => changeVolume(+e.target.value)}
                           />
                        </div>
                     </div>


                  </div>
               </PopupContent>
            </Popup>

            <Button className={classes.button} onClick={handlePlayPause}>
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
            <Button
               disabled={!lyrics.length}
               onClick={removeLyric}
               className={classes.button}
            >
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
