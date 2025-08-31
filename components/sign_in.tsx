"use client";

import { signIn } from "@/app/auth";
import { useSession } from "next-auth/react";
import { FaSpotify } from "react-icons/fa";

export default function SignIn() {
	const { data: session, status } = useSession();

	// Don't show sign-in button if user is already authenticated
	if (status === "loading" || session) {
		return null;
	}

	return (
		<form
			action={async () => {
				"use server";
				await signIn("spotify", { redirectTo: "/visuals" });
			}}
		>
			<button
				className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] min-w-max transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] cursor-pointer"
				type="submit"
			>
				<div className="flex gap-2 items-center">
					<FaSpotify />
					<span className="text-nowrap font-mono">Sign in with Spotify</span>
				</div>
			</button>
		</form>
	);
}
