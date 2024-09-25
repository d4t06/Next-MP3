import type { Config } from "tailwindcss";

const config: Config = {
   content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
 
   ],
   theme: {
      container: {
         center: true,
         padding: "10px",
      },
   },
   plugins: [],
};
export default config;
