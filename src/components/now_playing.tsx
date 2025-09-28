"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { SpotifyApi, PlaybackState } from "@spotify/web-api-ts-sdk";
import Image from "next/image";

interface NowPlayingViewProps {
	track?: {
		name: string;
		artists?: Array<{ name: string }>;
		album?: {
			name: string;
			images: Array<{ url: string; height: number; width: number }>;
		};
		images?: Array<{ url: string; height: number; width: number }>;
	};
	isPlaying?: boolean;
	isTransitioning?: boolean;
}

function NowPlayingView({
	track,
	isPlaying = false,
	isTransitioning = false,
}: NowPlayingViewProps) {
	const albumCover = track?.album?.images?.[0]?.url || track?.images?.[0]?.url;
	const artistNames = track?.artists?.map((artist) => artist.name).join(", ");

	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-zinc-900/60 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(22,163,74,0.3)] animate-float">
			<div className="max-w-screen-lg mx-auto grid grid-cols-12 gap-6">
				<div className="col-span-4 flex items-center justify-center">
					<div className="w-48 h-48 bg-zinc-800 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
						{albumCover ? (
							<Image
								src={albumCover}
								alt={`${track?.album?.name} album cover`}
								className="w-full h-full object-cover"
								width={192}
								height={192}
							/>
						) : (
							<span className="text-zinc-500 text-lg">No track</span>
						)}
					</div>
				</div>
				<div className="col-span-8 flex flex-col justify-center">
					<h2
						className={`text-white text-3xl font-bold mb-2 transition-opacity duration-300 ease-in-out ${
							isTransitioning ? "opacity-0" : "opacity-100"
						}`}
					>
						{track?.name || "Not Playing"}
					</h2>
					<p
						className={`text-zinc-400 text-xl transition-opacity duration-300 ease-in-out ${
							isTransitioning ? "opacity-0" : "opacity-100"
						}`}
					>
						{artistNames || "Connect Spotify to see what's playing"}
					</p>
					{track?.album?.name && (
						<p
							className={`text-zinc-500 text-lg mt-1 transition-opacity duration-300 ease-in-out ${
								isTransitioning ? "opacity-0" : "opacity-100"
							}`}
						>
							{track.album.name}
						</p>
					)}
					{track && (
						<div className="mt-2">
							<span
								className={`inline-flex items-center px-2 py-1 rounded-full text-xs text-white transition-all duration-300 ease-in-out ${
									isPlaying ? "bg-green-600" : "bg-gray-600"
								} ${isTransitioning ? "opacity-0" : "opacity-100"}`}
							>
								{isPlaying ? "● Playing" : "⏸ Paused"}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default function NowPlaying() {
	const { data: session, status } = useSession();
	const [nowPlaying, setNowPlaying] = useState<PlaybackState | null>(null);
	const [initialLoading, setInitialLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isTransitioning, setIsTransitioning] = useState(false);

	// Helper function to detect if track data has meaningfully changed
	const hasTrackChanged = (
		newData: PlaybackState | null,
		oldData: PlaybackState | null
	) => {
		// If both are null/undefined, no change
		if (!newData && !oldData) return false;

		// If one is null but the other isn't, that's a change
		if (!newData || !oldData) return true;

		// If both have no item (no track playing), no change
		if (!newData.item && !oldData.item) return false;

		// If one has an item but the other doesn't, that's a change
		if (!newData.item || !oldData.item) return true;

		const newTrackId = newData.item.id;
		const oldTrackId = oldData.item.id;
		const newIsPlaying = newData.is_playing;
		const oldIsPlaying = oldData.is_playing;

		// Only consider it a change if track ID or playing state actually changed
		return newTrackId !== oldTrackId || newIsPlaying !== oldIsPlaying;
	};

	useEffect(() => {
		if (
			status === "authenticated" &&
			session?.user &&
			session.user.accessToken
		) {
			const fetchNowPlaying = async () => {
				try {
					// Only show loading state if this is the first fetch
					if (!nowPlaying) {
						setInitialLoading(true);
					}
					setError(null);
					const accessToken = session.user.accessToken;
					if (!accessToken) return;

					const sdk = SpotifyApi.withAccessToken(
						process.env.NEXT_PUBLIC_AUTH_SPOTIFY_ID as string,
						accessToken
					);

					const result = await sdk.player.getCurrentlyPlayingTrack();

					// Check if data has actually changed
					if (hasTrackChanged(result, nowPlaying)) {
						// Only transition if we already have data (not first load)
						if (nowPlaying) {
							// Start fade out
							setIsTransitioning(true);

							// Wait for fade out to complete, then update data and fade in
							setTimeout(() => {
								setNowPlaying(result);
								setIsTransitioning(false);
							}, 150); // Half of the transition duration
						} else {
							// First load, no transition needed
							setNowPlaying(result);
						}
					} else {
						// No meaningful change, just update silently
						setNowPlaying(result);
					}
				} catch (error) {
					console.error("Error fetching now playing:", error);
					// Only show error if we don't have existing data
					if (!nowPlaying) {
						setError("Failed to fetch current track. Please try again.");
					}
				} finally {
					setInitialLoading(false);
				}
			};

			// Fetch initially
			fetchNowPlaying();

			// Set up interval to fetch every 5 seconds
			const interval = setInterval(fetchNowPlaying, 5000);

			// Clean up interval on component unmount
			return () => clearInterval(interval);
		}
	}, [status, session?.user?.accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

	if (status === "loading") {
		return (
			<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-zinc-900/60 backdrop-blur-md rounded-xl">
				<div className="text-white text-xl">Loading session...</div>
			</div>
		);
	}

	if (initialLoading) {
		return (
			<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-zinc-900/60 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(22,163,74,0.3)] animate-float">
				<div className="max-w-screen-lg mx-auto grid grid-cols-12 gap-6">
					<div className="col-span-4 flex items-center justify-center">
						<div className="w-48 h-48 bg-zinc-800 rounded-lg animate-pulse"></div>
					</div>
					<div className="col-span-8 flex flex-col justify-center">
						<div className="h-9 bg-zinc-700 rounded animate-pulse mb-2"></div>
						<div className="h-6 bg-zinc-700 rounded animate-pulse w-3/4 mb-1"></div>
						<div className="h-5 bg-zinc-700 rounded animate-pulse w-1/2 mt-1"></div>
						<div className="mt-2">
							<div className="h-6 bg-zinc-700 rounded-full animate-pulse w-20"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-red-900/60 backdrop-blur-md rounded-xl">
				<div className="text-white text-xl mb-2">Error</div>
				<div className="text-red-200">{error}</div>
			</div>
		);
	}

	return (
		<NowPlayingView
			track={nowPlaying?.item}
			isPlaying={nowPlaying?.is_playing}
			isTransitioning={isTransitioning}
		/>
	);
}
