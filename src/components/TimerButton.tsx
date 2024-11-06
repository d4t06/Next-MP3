import Button from "@/share/_components/Button";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import Modal from "./Modal";
import useTimer from "@/hooks/useTimer";
import { ModalRef } from "@/hooks/useModal";
import Tooltip from "@/share/_components/Tooltip";

type Props = {
   isPlaying: boolean;
   audioEle: HTMLAudioElement;
   disable: boolean;
};

const COUNT_LIST = [3, 5, 7, 10];

export default function TimerButton({ audioEle, isPlaying, disable }: Props) {
   const modalRef = useRef<ModalRef>(null);

   const { isActive, setIsActive, countDown, clearTimer } = useTimer({
      audioEle,
      isPlaying,
   });

   const toggleModal = () => modalRef.current?.toggle();

   const handleActiveTimer = (count: number) => {
      setIsActive(count);
      toggleModal();
   };

   const handleTriggerClick = () => {
      if (countDown) clearTimer(true);
      else toggleModal();
   };

   const classes = {
      triggerModalBtn: `group h-full timer-btn ${countDown ? "w-12" : "w-10"}`,
      timerBtn: "mt-2 ml-2",
   };

   const renderItems = COUNT_LIST.map((count, index) => {
      return (
         <Button
            key={index}
            onClick={() => handleActiveTimer(count)}
            className={`${classes.timerBtn}`}
         >
            {count} songs
         </Button>
      );
   });

   return (
      <>
         <Tooltip content={isActive ? "Cancel" : "Sleep timer"}>
            <Button
               disabled={disable}
               className={classes.triggerModalBtn}
               size={"clear"}
               active={!!countDown}
               onClick={handleTriggerClick}
            >
               {countDown ? (
                  <>
                     <span className="group-hover:hidden text-sm">
                        {countDown.toString().padStart(2, "0")}
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
                  {renderItems}
               </div>
            </div>
         </Modal>
      </>
   );
}
