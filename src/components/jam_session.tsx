"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import NowPlaying from "@/components/now_playing";
import CollaborativeJam from "@/components/collaborative_jam";
import JamCreator from "@/components/jam_creator";

export default function JamSession() {
	const searchParams = useSearchParams();
	const jamCode = searchParams?.get("jam");
	const [showCreator, setShowCreator] = useState(false);

	// If there's a jam code in the URL, show collaborative jam
	if (jamCode) {
		return <CollaborativeJam jamCode={jamCode.toUpperCase()} />;
	}

	// If showing creator modal
	if (showCreator) {
		return (
			<div className="relative">
				<NowPlaying />
				<JamCreator onClose={() => setShowCreator(false)} />
			</div>
		);
	}

	// Default solo mode with option to create jam
	return (
		<div className="relative">
			<NowPlaying />
			<button
				onClick={() => setShowCreator(true)}
				className="fixed bottom-20 right-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors duration-200 font-medium"
			>
				Create Jam
			</button>
		</div>
	);
}