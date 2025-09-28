"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CollaborativeJam from "@/components/collaborative_jam";

export default function JamSession() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const jamCode = searchParams?.get("jam");
	const [isCreating, setIsCreating] = useState(false);

	// Auto-create a jam when no jam code is present
	useEffect(() => {
		if (jamCode) return; // Don't create if already have a jam code

		const createJam = async () => {
			if (isCreating) return; // Prevent duplicate creation

			setIsCreating(true);
			try {
				const response = await fetch("/api/jams/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({}), // No name needed
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to create jam");
				}

				// Redirect to the created jam
				router.push(`/?jam=${data.jam.code}`);
			} catch (error) {
				console.error("Error auto-creating jam:", error);
				setIsCreating(false);
			}
		};

		createJam();
	}, [jamCode, router, isCreating]);

	// If there's a jam code in the URL, show collaborative jam
	if (jamCode) {
		return <CollaborativeJam jamCode={jamCode.toUpperCase()} />;
	}

	// Show loading state while creating jam
	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-zinc-900/60 backdrop-blur-md rounded-xl">
			<div className="text-white text-xl">Creating your jam...</div>
		</div>
	);
}