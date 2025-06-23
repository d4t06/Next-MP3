import { useEffect, useRef } from "react";
import { useEditLyricContext } from "../_components/EditLyricContext";

export default function useEditorList() {
	const { currentLyricIndex } = useEditLyricContext();

	const lyricRefs = useRef<HTMLParagraphElement[]>([]);

	const behavior = useRef<ScrollBehavior>("instant");

	useEffect(() => {
		if (!lyricRefs.current[currentLyricIndex]) return;

		lyricRefs.current[currentLyricIndex].scrollIntoView({
			behavior: behavior.current,
			block: "center",
		});

		if (behavior.current === "instant") behavior.current = "smooth";
	}, [currentLyricIndex]);

	return { lyricRefs };
}
