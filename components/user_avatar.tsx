import { auth } from "@/app/auth";

export default async function UserAvatar() {
	const session = await auth();

	if (!session?.user || !session.user.image) return null;

	return (
		<div>
			<img
				className="rounded-4xl size-1/2"
				src={session.user.image}
				alt={"User Avatar"}
			/>
		</div>
	);
}
