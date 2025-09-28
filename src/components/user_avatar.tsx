import { auth } from "@/app/auth";
import Image from "next/image";

export default async function UserAvatar() {
	const session = await auth();

	if (!session?.user || !session.user.image) return null;

	return (
		<div>
			<Image
				className="rounded-4xl size-1/2"
				src={session.user.image}
				alt={`${session.user.name || 'User'} Avatar`}
				width={96}
				height={96}
			/>
		</div>
	);
}
