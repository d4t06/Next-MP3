"use server";

import { sleep } from "@/share/utils/appHelper";
import { revalidateTag } from "next/cache";

export async function runRevalidateTag(tag: string) {
   console.log(">>> call revalidate tag", tag);
   if (process.env.NODE_ENV === "development") await sleep(500);
   revalidateTag(tag);
}
