import SignOut from "@/components/sign_out";
import UserAvatar from "@/components/user_avatar";
import NowPlaying from "@/components/now_playing";

export default function Visuals() {
	return (
		<div className="font-sans grid items-center justify-items-center min-h-screen pb-20 sm:p-20">
			<main className="flex items-center sm:items-start">
				<NowPlaying />
			</main>
			<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
				<SignOut />
			</footer>
		</div>
	);
}
