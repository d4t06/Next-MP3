import { ArrowPathIcon } from "@heroicons/react/16/solid";
import Center from "./Center";

export default function LoadingOverlay() {
	return (
		<div className="absolute left-0 top-0 bottom-0 w-full flex items-center justify-center bg-white/60">
			<div className="w-9 h-9 animate-spin rounded-full border border-4 border-r-amber-900"></div>
		</div>
	);
}
