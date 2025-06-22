function timeToSeconds(timeString: string) {
   const [_h, m, sAndMs] = timeString.split(":");
   const [s, ms] = sAndMs.split(",");

   return +m * 60 + +s + +ms / 1000;
}

export function converSrt(content: string) {
   const lines = content.split("\n");
   const result = [];
   let bucket: Lyric = {
      start: 0,
      end: 0,
      text: "",
   };

   for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // gap line
      if (!line) {
         if (!bucket.text) continue;
         bucket.text = bucket.text.trim();

         result.push({ ...bucket });
         bucket.text = "";
      }

      //   index line
      if (!isNaN(+line)) continue;

      // This is the time range line
      if (line.includes("-->")) {
         const [startTimeStr, endTimeStr] = line
            .split("-->")
            .map((s) => s.trim());
         const start = timeToSeconds(startTimeStr);
         const end = timeToSeconds(endTimeStr);

         if (isNaN(start) || isNaN(end)) throw new Error("File malformed");
         Object.assign(bucket, { start, end });

         // this is text line
      } else {
         bucket.text += line + " "; // lyric may has 2 lines
      }
   }

   return result;
}
