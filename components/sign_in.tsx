import { signIn } from "@/app/auth";
import { FaSpotify } from "react-icons/fa";

export default function SignIn() {
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
					<span className="text-nowrap font-mono">
						Sign in with Spotify
					</span>
				</div>



			</button>
		</form>
	);
}
