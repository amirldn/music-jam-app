import SignOut from "@/components/sign_out";
import JamSession from "@/components/jam_session";
import { Suspense } from "react";

function VisualsContent() {
	return (
		<div className="font-sans grid items-center justify-items-center min-h-screen pb-20 sm:p-20">
			<main className="flex items-center sm:items-start">
				<JamSession />
			</main>
			<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
				<SignOut />
			</footer>
		</div>
	);
}

export default function Visuals() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<VisualsContent />
		</Suspense>
	);
}
