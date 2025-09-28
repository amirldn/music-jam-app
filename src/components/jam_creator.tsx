"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface JamCreatorProps {
	onClose: () => void;
}

export default function JamCreator({ onClose }: JamCreatorProps) {
	const [jamName, setJamName] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleCreateJam = async () => {
		setIsCreating(true);
		setError(null);

		try {
			const response = await fetch("/api/jams/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: jamName || "Untitled Jam" }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to create jam");
			}

			// Redirect to the jam
			router.push(`/?jam=${data.jam.code}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create jam");
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-zinc-900/90 backdrop-blur-md rounded-xl p-8 max-w-md w-full mx-4 shadow-[0_0_30px_rgba(22,163,74,0.3)]">
				<h2 className="text-white text-2xl font-bold mb-6">Create a Music Jam</h2>

				<div className="mb-6">
					<label htmlFor="jamName" className="block text-zinc-300 text-sm font-medium mb-2">
						Jam Name (optional)
					</label>
					<input
						id="jamName"
						type="text"
						value={jamName}
						onChange={(e) => setJamName(e.target.value)}
						placeholder="Enter jam name..."
						className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-green-500 focus:outline-none transition-colors"
						disabled={isCreating}
					/>
				</div>

				{error && (
					<div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
						{error}
					</div>
				)}

				<div className="flex gap-3">
					<button
						onClick={onClose}
						disabled={isCreating}
						className="flex-1 px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						onClick={handleCreateJam}
						disabled={isCreating}
						className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
					>
						{isCreating ? "Creating..." : "Create Jam"}
					</button>
				</div>
			</div>
		</div>
	);
}