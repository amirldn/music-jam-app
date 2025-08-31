import { SessionProvider } from "next-auth/react";
import SignOut from "../../../components/sign_out";
import UserAvatar from "../../../components/user_avatar";
import NowPlaying from "../../../components/now_playing";

export default function Visuals() {
	return (
		<div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				<UserAvatar />
				<SessionProvider>
					<NowPlaying />
				</SessionProvider>
			</main>
			<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
				<SignOut />
			</footer>
		</div>
	);
}
