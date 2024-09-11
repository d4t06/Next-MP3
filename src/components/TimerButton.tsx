import Button from "@/share/_components/Button";
import { ClockIcon } from "@heroicons/react/24/outline";
import { RefObject, useState } from "react";
import Modal from "./Modal";
import useTimer from "@/hooks/useTimer";
import { formatTime } from "@/share/utils/appHelper";

type Props = {
   isPlaying: boolean;
   audioRef: RefObject<HTMLAudioElement>;
};

export default function TimerButton({ audioRef, isPlaying }: Props) {
   const [isOpenModal, setIsOpenModal] = useState(false);

   const { setIsActive, countDown, handleEndTimer } = useTimer({
      audioRef,
      isPlaying,
   });

   const closeModal = () => setIsOpenModal(false);

   const handleActiveTimer = (time: number) => {
      setIsActive(time * 60);
      closeModal();
   };

   const handleTriggerClick = () => {
      if (countDown) handleEndTimer(true);
      else setIsOpenModal(true);
   };

   const classes = {
      triggerModalBtn: `${countDown ? "w-12" : "w-10"}`,
      timerBtn: "mt-2 ml-2",
   };

   return (
      <>
         <Button
            className={classes.triggerModalBtn}
            size={"clear"}
            active={!!countDown}
            onClick={handleTriggerClick}
         >
            {countDown ? (
               <span className="text-sm"> {formatTime(countDown)}</span>
            ) : (
               <ClockIcon className="w-6" />
            )}
         </Button>

         {isOpenModal && (
            <Modal closeModal={closeModal}>
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
         )}
      </>
   );
}
