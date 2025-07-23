"use client";

import { NEXT_URL } from "next/dist/client/components/app-router-headers";
// init state
import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useState,
} from "react";

const useToast = () => {
   const [toasts, setToasts] = useState<Toast[]>([]);

   const setErrorToast = (message: string = "Somethings went wrong") =>
      setToasts((t) => [
         ...t,
         { title: "error", id: Date.now() + "", desc: message },
      ]);

   const setSuccessToast = (message: string = "Somethings went successful") =>
      setToasts((t) => [
         ...t,
         { title: "success", id: Date.now() + "", desc: `${message}` },
      ]);

   return { toasts, setToasts, setErrorToast, setSuccessToast };
};

type ContextType = ReturnType<typeof useToast>;

const ToastContext = createContext<ContextType | null>(null);

// define context provider
const ToastProvider = ({ children }: { children: ReactNode }) => {
   return (
      <ToastContext.Provider value={useToast()}>
         {children}
      </ToastContext.Provider>
   );
};

// define useToastContext Hook
const useToastContext = () => {
   const ct = useContext(ToastContext);
   if (!ct) throw new Error("ToastProvider not provided");

   return ct;
};

export default ToastProvider;
export { useToastContext };
