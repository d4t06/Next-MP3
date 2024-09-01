"use client";
//  1 state type

import {
   useCallback,
   createContext,
   useReducer,
   ReactNode,
   useContext,
} from "react";

type StateType = {
   songs: Song[];
};

const initState: StateType = {
   songs: [],
};

// 2 reducer
const enum REDUCER_ACTION_TYPE {
   SET_QUEUE,
   RESET,
}

type SetQueue = {
   type: REDUCER_ACTION_TYPE.SET_QUEUE;
   payload: Song[];
};

type Reset = {
   type: REDUCER_ACTION_TYPE.RESET;
};

const reducer = (state: StateType, action: SetQueue | Reset): StateType => {
   switch (action.type) {
      case REDUCER_ACTION_TYPE.SET_QUEUE:
         return {
            ...state,
            songs: action.payload,
         };

      case REDUCER_ACTION_TYPE.RESET:
         return {
            ...state,
            ...initState,
         };

      default:
         return state;
   }
};

// 3 hook

const useQueueSongHook = () => {
   const [state, dispatch] = useReducer(reducer, initState);

   const setQueue = useCallback((songs: Song[]) => {
      dispatch({ type: REDUCER_ACTION_TYPE.SET_QUEUE, payload: songs });
   }, []);

   const resetQueue = useCallback(() => {
      dispatch({ type: REDUCER_ACTION_TYPE.RESET });
   }, []);

   return { state, setQueue, resetQueue };
};

// context

type ContextType = ReturnType<typeof useQueueSongHook>;

const initContextState: ContextType = {
   resetQueue: () => {},
   setQueue: () => {},
   state: initState,
};

const QueueSongContext = createContext<ContextType>(initContextState);

export default function QueueSongProvider({
   children,
}: {
   children: ReactNode;
}) {
   return (
      <QueueSongContext.Provider value={useQueueSongHook()}>
         {children}
      </QueueSongContext.Provider>
   );
}

export function useQueue() {
   const context = useContext(QueueSongContext);

   const {
      state: { ...restState },
      ...restSetState
   } = context;
   return {
      ...restSetState,
      ...restState,
   };
}
