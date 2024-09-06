"use client";

import {
   ReactNode,
   createContext,
   useCallback,
   useContext,
   useReducer,
} from "react";

// 1 state

type StateType = {
   currentSong: Song | null;
   currentIndex: number;
   from: "playlist" | "songs" | "";
};

const initState: StateType = {
   currentSong: null,
   currentIndex: 0,
   from: "",
};

// reducer
const enum REDUCER_ACTION_TYPE {
   SET,
   RESET,
}

type SetCurrentSong = {
   type: REDUCER_ACTION_TYPE.SET;
   payload: {
      index: number;
      from: StateType["from"];
      song: Song;
   };
};

type Reset = {
   type: REDUCER_ACTION_TYPE.RESET;
};

const reducer = (
   state: StateType,
   action: SetCurrentSong | Reset
): StateType => {
   switch (action.type) {
      case REDUCER_ACTION_TYPE.SET:
         const { index, from, song } = action.payload;

         return { ...state, currentIndex: index, currentSong: song, from };

      case REDUCER_ACTION_TYPE.RESET:
         return { ...state, ...initState };

      default:
         return state;
   }
};

// 3 hook
const useCurrentSongContext = () => {
   const [state, dispatch] = useReducer(reducer, initState);

   const setCurrentSong = useCallback((payload: SetCurrentSong["payload"]) => {
      return dispatch({
         type: REDUCER_ACTION_TYPE.SET,
         payload,
      });
   }, []);

   const resetCurrentSong = useCallback(() => {
      dispatch({
         type: REDUCER_ACTION_TYPE.RESET,
      });
   }, []);

   return { state, resetCurrentSong, setCurrentSong };
};

// 4 context state
type ContextType = ReturnType<typeof useCurrentSongContext>;

const initContextState: ContextType = {
   resetCurrentSong: () => {},
   setCurrentSong: () => {},
   state: initState,
};

// 5 context
const CurrentSongContext = createContext<ContextType>(initContextState);

export default function CurrentSongProvider({
   children,
}: {
   children: ReactNode;
}) {
   return (
      <CurrentSongContext.Provider value={useCurrentSongContext()}>
         {children}
      </CurrentSongContext.Provider>
   );
}
export const useCurrentSong = () => {
   const context = useContext(CurrentSongContext);

   const {
      state: { ...restState },
      ...restSetState
   } = context;
   return {
      ...restSetState,
      ...restState,
   };
};
