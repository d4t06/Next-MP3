import Button from "@/share/_components/Button";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { RefObject, useRef } from "react";
import Modal from "./Modal";
import useTimer from "@/hooks/useTimer";
import { formatTime } from "@/share/utils/appHelper";
import { ModalRef } from "@/hooks/useModal";
import Tooltip from "@/share/_components/Tooltip";

type Props = {
   isPlaying: boolean;
   audioEle: HTMLAudioElement
};

export default function TimerButton({ audioEle, isPlaying }: Props) {
   const modalRef = useRef<ModalRef>(null);

   const { isActive, setIsActive, countDown, handleEndTimer } = useTimer({
      audioEle,
      isPlaying,
   });

   const toggleModal = () => modalRef.current?.toggle();

   const handleActiveTimer = (time: number) => {
      setIsActive(time * 60);
      toggleModal();
   };

   const handleTriggerClick = () => {
      if (countDown) handleEndTimer(true);
      else toggleModal();
   };

   const classes = {
      triggerModalBtn: `group h-full timer-btn ${countDown ? "w-12" : "w-10"}`,
      timerBtn: "mt-2 ml-2",
   };

   return (
      <>
         <Tooltip content={isActive ? "Cancel" : "Sleep timer"}>
            <Button
               className={classes.triggerModalBtn}
               size={"clear"}
               active={!!countDown}
               onClick={handleTriggerClick}
            >
               {countDown ? (
                  <>
                     <span className="group-hover:hidden text-sm">
                        {formatTime(countDown)}
                     </span>
                     <XMarkIcon className="w-6 hidden group-hover:block pointer-events-none" />
                  </>
               ) : (
                  <ClockIcon className="w-6 pointer-events-none" />
               )}
            </Button>
         </Tooltip>

         <Modal ref={modalRef}>
            <div className="w-[300px] max-w-[85vw]">
               <div className="text-xl font-semibold">Timer</div>
               <div className="mt-3 flex flex-wrap -ml-2 pb-2">
                  <Button
                     onClick={() => handleActiveTimer(15)}
                     className={`${classes.timerBtn}`}
                  >
                     15 min
                  </Button>
                  <Button
                     onClick={() => handleActiveTimer(20)}
                     className={`${classes.timerBtn}`}
                  >
                     20 min
                  </Button>
                  <Button
                     onClick={() => handleActiveTimer(25)}
                     className={`${classes.timerBtn}`}
                  >
                     25 min
                  </Button>
                  <Button
                     onClick={() => handleActiveTimer(30)}
                     className={`${classes.timerBtn}`}
                  >
                     30 min
                  </Button>
               </div>
            </div>
         </Modal>
      </>
   );
}
