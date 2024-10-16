import type { Config } from "tailwindcss";

const config: Config = {
   corePlugins: {
      backgroundOpacity: false,
      textOpacity: false,
      borderOpacity: false,
      boxShadowColor: false,
   },
   content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
   theme: {
      container: {
         center: true,
         padding: "10px",
      },
   },
   plugins: [],
};
export default config;
