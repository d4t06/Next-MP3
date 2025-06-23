import useAudioControl from "@/hooks/useAudioControl";
import Button from "@/share/_components/Button";
import { EyeIcon, PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import {
   BackwardIcon,
   ExclamationCircleIcon,
   PlusIcon,
   ForwardIcon,
   ArrowPathIcon,
   MinusIcon,
   Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";
import {
   InputModal,
   MenuContentWrapper,
   Modal,
   ModalRef,
   Popup,
   PopupContent,
   PopupTrigger,
} from "@/share/_components";
import { useEditLyricContext } from "./EditLyricContext";
import { useLyricAction } from "../_hooks/useEditLyricAction";
import MenuBtn from "./MenuBtn";

export type LyricEditorControlRef = {
   seek: (second: number) => void;
   pause: () => void;
};

function LyricEditorControl({}, ref: Ref<LyricEditorControlRef>) {
   const { audioRef } = useEditLyricContext();

   if (!audioRef.current) return <></>;

   const modalRef = useRef<ModalRef>(null);

   const {
      setBaseLyric,
      baseLyric,
      setIsChanged,
      lyrics,
      setIsPreview,
      isPreview,
   } = useEditLyricContext();
   
   const {
      handlePlayPause,
      pause,
      backward,
      forward,
      status,
      seek,
      isClickPlay,
      progressLineRef,
      currentTimeRef,
      durationRef,
   } = useAudioControl({
      audioEle: audioRef.current,
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
      audioEle: audioRef.current,
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
         <div className="flex items-center justify-between">
            <div className="flex flex-wrap -mt-2 -ml-2">
               <Popup className="mt-2 ml-2">
                  <PopupTrigger>
                     <Button className="h-full" colors={"second"}>
                        <Cog6ToothIcon className="w-6" />
                     </Button>
                  </PopupTrigger>

                  <PopupContent className="top-[calc(100%+8px)] left-0 z-[9]">
                     <MenuContentWrapper
                        noStyle
                        className="w-[220px] text-amber-800 bg-amber-100 p-2 border-amber-800"
                     >
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
                     </MenuContentWrapper>
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
                  disabled={!lyrics.length || !baseLyric}
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
                  onClick={() => {
                     setIsPreview(!isPreview);
                     pause();
                  }}
                  className={classes.button}
               >
                  <EyeIcon className="w-6" />
                  <span>{!isPreview ? "Preview" : "Edit"}</span>
               </Button>
            </div>

            <div className="ml-5">
               <MenuBtn pause={pause} />
            </div>
         </div>

         <div className="flex items-center mt-3">
            <div
               className="text-sm text-amber-800 w-[50px]"
               ref={currentTimeRef}
            >
               00:00
            </div>

            <div
               ref={progressLineRef}
               style={{ backgroundColor: "rgba(146, 64, 14, .3)" }}
               className={`h-1 rounded-full w-full`}
            ></div>

            <div
               className="text-sm text-amber-800 w-[50px] text-right"
               ref={durationRef}
            >
               00:00
            </div>
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
