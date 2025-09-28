"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { SpotifyApi, PlaybackState } from "@spotify/web-api-ts-sdk";

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
}

function NowPlayingView({ track, isPlaying = false }: NowPlayingViewProps) {
	const albumCover = track?.album?.images?.[0]?.url || track?.images?.[0]?.url;
	const artistNames = track?.artists?.map(artist => artist.name).join(", ");

	return (
		<div className="fixed top-1/2 left-1/2 transform p-6 bg-zinc-900/60 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(22,163,74,0.3)] animate-float">
			<div className="max-w-screen-lg mx-auto grid grid-cols-12 gap-6">
				<div className="col-span-4 flex items-center justify-center">
					<div className="w-48 h-48 bg-zinc-800 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
						{albumCover ? (
							<img
								src={albumCover}
								alt={`${track?.album?.name} album cover`}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-zinc-500 text-lg">No track</span>
						)}
					</div>
				</div>
				<div className="col-span-8 flex flex-col justify-center">
					<h2 className="text-white text-3xl font-bold mb-2">
						{track?.name || "Not Playing"}
					</h2>
					<p className="text-zinc-400 text-xl">
						{artistNames || "Connect Spotify to see what's playing"}
					</p>
					{track?.album?.name && (
						<p className="text-zinc-500 text-lg mt-1">
							{track.album.name}
						</p>
					)}
					{track && (
						<div className="mt-2">
							<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs text-white ${
								isPlaying ? 'bg-green-600' : 'bg-gray-600'
							}`}>
								{isPlaying ? '● Playing' : '⏸ Paused'}
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
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (status === "authenticated" && session?.user?.accessToken) {
			const fetchNowPlaying = async () => {
				try {
					setLoading(true);
					const accessToken = session.user.accessToken;
					if (!accessToken) return;

					const sdk = SpotifyApi.withAccessToken(
						process.env.NEXT_PUBLIC_AUTH_SPOTIFY_ID as string,
						accessToken
					);

					const result = await sdk.player.getCurrentlyPlayingTrack();
					setNowPlaying(result);
				} catch (error) {
					console.error("Error fetching now playing:", error);
				} finally {
					setLoading(false);
				}
			};

			// Fetch initially
			fetchNowPlaying();

			// Set up interval to fetch every 5 seconds
			const interval = setInterval(fetchNowPlaying, 5000);

			// Clean up interval on component unmount
			return () => clearInterval(interval);
		}
	}, [status, session?.user?.accessToken]);

	if (status === "loading" || loading) {
		return <div>Loading...</div>;
	}

	return (
		<NowPlayingView
			track={nowPlaying?.item}
			isPlaying={nowPlaying?.is_playing}
		/>
	);
}
