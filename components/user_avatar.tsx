"use client";

import { useSession } from "next-auth/react";

export default function UserAvatar() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <div>Loading...</div>;
	}

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
