// "use client";

import { useEffect } from "react";

export default function useScrollToSongWhenKeyPress() {
	const handleKeyboardPress = (e: KeyboardEvent) => {
		const isLetterOrNumber = /^[a-zA-Z0-9]$/;
		if (isLetterOrNumber.test(e.key)) {
			const firstElement = document.querySelector(
				`div[data-first_letter=${
					typeof e.key === "number" ? e.key : "'" + e.key + "'"
				}]`,
			);

			if (firstElement)
				firstElement.scrollIntoView({
					block: "center",
					behavior: "instant",
				});
		}
	};

	useEffect(() => {
		window.addEventListener("keypress", handleKeyboardPress);

		return () => {
			window.removeEventListener("keypress", handleKeyboardPress);
		};
	}, []);
}
