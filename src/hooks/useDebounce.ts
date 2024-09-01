import { useEffect } from "react";
import { useState } from "react";

function useDebounce(value: string | number, delay: number) {
   const [debounceValue, setDebounceValue] = useState(value);

   useEffect(() => {
      if (!value) {
         setDebounceValue("");
         return;
      }

      const timeId = setTimeout(() => {
         setDebounceValue(value);
      }, delay);

      return () => {
         clearTimeout(timeId);
      };
   }, [value, delay]);

   return debounceValue;
}

export default useDebounce;
