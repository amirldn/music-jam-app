"use client";

import { useSession } from "next-auth/react";
import { Suspense } from "react";
import SignOut from "@/components/sign_out";
import JamSession from "@/components/jam_session";
import LandingPage from "@/components/landing_page";

function HomeContent() {
	const { status } = useSession();

	if (status === "loading") {
		return (
			<div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
				<div className="text-white text-xl">Loading...</div>
			</div>
		);
	}

	if (status === "unauthenticated") {
		return <LandingPage />;
	}

	// Authenticated user - show the jam session functionality
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

export default function Home() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
				<div className="text-white text-xl">Loading...</div>
			</div>
		}>
			<HomeContent />
		</Suspense>
	);
}
