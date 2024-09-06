import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp({
   apiKey: process.env.NEXT_PUBLIC_APIKEY,
   appId: process.env.NEXT_PUBLIC_APPID,
   projectId: process.env.NEXT_PUBLIC_PROJECTID,
   storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
});

// Initialize Storage
const store = getStorage(app);

export { store };
