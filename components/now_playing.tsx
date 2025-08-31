"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export default function NowPlaying() {
	const { data: session, status } = useSession();
	const [nowPlaying, setNowPlaying] = useState<any>(null);
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

	if (status === "loading") {
		return <div>Loading session...</div>;
	}

	if (!session) {
		return (
			<div>No active session - please sign in to see your now playing.</div>
		);
	}

	if (!session.user.accessToken) {
		return <div>No access token available - something went really wrong</div>;
	}

	if (loading) {
		return <div>Loading now playing...</div>;
	}

	return (
		<div>
			{nowPlaying?.item ? (
				<div>Now playing: {nowPlaying.item.name}</div>
			) : (
				<div>Nothing is playing right now.</div>
			)}
		</div>
	);
}
