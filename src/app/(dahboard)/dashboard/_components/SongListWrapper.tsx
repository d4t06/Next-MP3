"use client";

import useScrollToSongWhenKeyPress from "@/hooks/useScrollToSongWhenKeyPress";
import { ReactNode } from "react";

export default function SongListWrapper({children}: { children: ReactNode }) {
	useScrollToSongWhenKeyPress();

	return children;
}
