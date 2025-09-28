"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { supabase, type Database } from "@/lib/supabase";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import MultiUserDisplay from "@/components/multi_user_display";

type JamParticipant = Database["public"]["Tables"]["jam_participants"]["Row"];
type Jam = Database["public"]["Tables"]["jams"]["Row"];

interface CollaborativeJamProps {
	jamCode: string;
}

export default function CollaborativeJam({ jamCode }: CollaborativeJamProps) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [jam, setJam] = useState<Jam | null>(null);
	const [participants, setParticipants] = useState<JamParticipant[]>([]);
	const [isJoined, setIsJoined] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Join jam function that can be called from multiple places
	const joinJam = useCallback(async () => {
		try {
			setError(null);
			setIsLoading(true);
			const response = await fetch(`/api/jams/${jamCode}/join`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to join jam");
			}

			setJam(data.jam);
			setIsJoined(true);
			// Fetch participants after joining
			try {
				const { data: participantsData, error } = await supabase
					.from("jam_participants")
					.select("*")
					.eq("jam_id", data.jam.id)
					.order("joined_at", { ascending: true });

				if (error) throw error;
				setParticipants(participantsData || []);
			} catch (err) {
				console.error("Error fetching participants:", err);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to join jam");
		} finally {
			setIsLoading(false);
		}
	}, [jamCode]);

	// Join jam when component mounts and user is authenticated
	useEffect(() => {
		if (status === "authenticated" && session?.user && !isJoined) {
			joinJam();
		}
	}, [status, session, jamCode, isJoined, joinJam]);

	// Set up real-time subscription for participants
	useEffect(() => {
		if (!jam) return;

		const fetchParticipants = async () => {
			try {
				console.log("[CollaborativeJam] Fetching participants for jam:", jam.id);
				const { data, error } = await supabase
					.from("jam_participants")
					.select("*")
					.eq("jam_id", jam.id)
					.order("joined_at", { ascending: true });

				if (error) throw error;
				console.log("[CollaborativeJam] Fetched participants:", data?.map(p => ({
					id: p.id,
					user_name: p.user_name,
					spotify_track_id: p.spotify_track_id,
					is_playing: p.is_playing,
					last_updated: p.last_updated
				})));
				setParticipants(data || []);
			} catch (err) {
				console.error("[CollaborativeJam] Error fetching participants:", err);
			}
		};

		const channel = supabase
			.channel(`jam-${jam.id}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "jam_participants",
					filter: `jam_id=eq.${jam.id}`,
				},
				(payload) => {
					console.log("[CollaborativeJam] Real-time participant change:", payload);
					fetchParticipants();
				}
			)
			.subscribe((status) => {
				console.log("[CollaborativeJam] Subscription status:", status);
			});

		// Fetch participants immediately when subscription is set up
		fetchParticipants();

		// Also set up a manual refresh interval as backup
		const refreshInterval = setInterval(() => {
			console.log("[CollaborativeJam] Manual refresh of participants");
			fetchParticipants();
		}, 3000); // Refresh every 3 seconds

		return () => {
			supabase.removeChannel(channel);
			clearInterval(refreshInterval);
		};
	}, [jam]);

	// Poll current user's Spotify data and update server
	useEffect(() => {
		if (!isJoined || status !== "authenticated" || !session?.user?.accessToken) return;

		const fetchAndUpdateTrack = async () => {
			try {
				console.log("[CollaborativeJam] Fetching current track...");
				const accessToken = session.user.accessToken;
				if (!accessToken) {
					console.log("[CollaborativeJam] No access token available");
					return;
				}

				const sdk = SpotifyApi.withAccessToken(
					process.env.NEXT_PUBLIC_AUTH_SPOTIFY_ID as string,
					accessToken
				);

				const result = await sdk.player.getCurrentlyPlayingTrack();
				console.log("[CollaborativeJam] Spotify API result:", {
					hasResult: !!result,
					hasItem: !!result?.item,
					trackId: result?.item?.id,
					trackName: result?.item?.name,
					isPlaying: result?.is_playing,
					resultType: typeof result
				});

				// Update server with track ID only
				// Handle both null result and missing item cases
				let trackId = null;
				let isPlaying = false;

				if (result && result.item && result.item.id) {
					trackId = result.item.id;
					isPlaying = !!result.is_playing;
				} else if (result && !result.item) {
					console.log("[CollaborativeJam] Spotify result has no item (nothing playing)");
				} else if (!result) {
					console.log("[CollaborativeJam] Spotify returned null/undefined (no active device or no track)");
				}

				console.log("[CollaborativeJam] Sending to server:", { trackId, isPlaying });

				const response = await fetch(`/api/jams/${jamCode}/update-track`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						track_id: trackId,
						is_playing: isPlaying,
					}),
				});

				console.log("[CollaborativeJam] Server response:", {
					status: response.status,
					ok: response.ok
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error("[CollaborativeJam] Server error:", errorData);
				}
			} catch (error) {
				console.error("[CollaborativeJam] Error fetching/updating track:", error);
			}
		};

		// Fetch initially
		fetchAndUpdateTrack();

		// Set up interval to update every 5 seconds
		const interval = setInterval(fetchAndUpdateTrack, 5000);

		return () => clearInterval(interval);
	}, [isJoined, status, session, jamCode]);


	const leaveJam = async () => {
		try {
			await fetch(`/api/jams/${jamCode}/leave`, {
				method: "POST",
			});
			router.push("/");
		} catch (err) {
			console.error("Error leaving jam:", err);
		}
	};

	if (status === "loading" || isLoading) {
		return (
			<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-zinc-900/60 backdrop-blur-md rounded-xl">
				<div className="text-white text-xl">Loading jam...</div>
			</div>
		);
	}

	if (status === "unauthenticated") {
		return (
			<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-zinc-900/60 backdrop-blur-md rounded-xl">
				<div className="text-white text-xl mb-4">Please sign in to join the jam</div>
				<button
					onClick={() => router.push("/api/auth/signin")}
					className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
				>
					Sign In
				</button>
			</div>
		);
	}

	if (error) {
		return (
			<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-red-900/60 backdrop-blur-md rounded-xl">
				<div className="text-white text-xl mb-2">Error</div>
				<div className="text-red-200 mb-4">{error}</div>
				<div className="flex gap-3">
					<button
						onClick={() => router.push("/")}
						className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors"
					>
						Go Back
					</button>
					<button
						onClick={() => {
							setError(null);
							setIsLoading(true);
							joinJam();
						}}
						className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (!isJoined || !jam) {
		return (
			<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-zinc-900/60 backdrop-blur-md rounded-xl">
				<div className="text-white text-xl">Joining jam...</div>
			</div>
		);
	}

	return (
		<div className="relative w-full">
			{/* Jam Header */}
			<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-zinc-900/80 backdrop-blur-md rounded-lg px-6 py-3">
				<div className="text-white text-center">
					<div className="text-lg font-bold">Music Jam</div>
					<div className="text-sm text-zinc-300">Code: {jam.code}</div>
				</div>
			</div>

			{/* Leave Jam Button */}
			<button
				onClick={leaveJam}
				className="fixed top-4 right-4 z-40 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
			>
				Leave Jam
			</button>

			{/* Multi-user Display */}
			<MultiUserDisplay participants={participants} />
		</div>
	);
}