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
   const [time, setTime] = useState<15 | 20 | 25 | 30 | 0>(0);

   const { setIsActive, countDown, handleEndTimer } = useTimer({ audioRef, isPlaying });

   const closeModal = () => {
      setIsOpenModal(false);
      setTime(0);
   };
   const handleActiveTimer = () => {
      setIsActive(time * 60);
      closeModal();
   };

   const handleTriggerClick = () => {
      if (countDown) handleEndTimer(true)
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
               <div className="w-[300px] max-w-[85vh]">
                  <div className="text-xl font-semibold">Timer</div>
                  <div className="mt-3 flex flex-wrap -ml2">
                     <Button
                        active={time === 15}
                        onClick={() => setTime(15)}
                        className={`${classes.timerBtn}`}
                     >
                        15 min
                     </Button>
                     <Button
                        active={time === 20}
                        onClick={() => setTime(20)}
                        className={`${classes.timerBtn}`}
                     >
                        20 min
                     </Button>
                     <Button
                        active={time === 25}
                        onClick={() => setTime(25)}
                        className={`${classes.timerBtn}`}
                     >
                        25 min
                     </Button>
                     <Button
                        active={time === 30}
                        onClick={() => setTime(30)}
                        className={`${classes.timerBtn}`}
                     >
                        30 min
                     </Button>
                  </div>

                  <div className="text-right mt-5">
                     <Button
                        colors={"second"}
                        disabled={!time}
                        onClick={handleActiveTimer}
                     >
                        Ok
                     </Button>
                  </div>
               </div>
            </Modal>
         )}
      </>
   );
}
