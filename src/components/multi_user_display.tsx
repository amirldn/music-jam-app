"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import Image from "next/image";
import type { Database } from "@/lib/supabase";

type JamParticipant = Database["public"]["Tables"]["jam_participants"]["Row"];

interface Track {
	id: string;
	name: string;
	artists: Array<{ name: string }>;
	album: {
		name: string;
		images: Array<{ url: string; height: number; width: number }>;
	};
}

interface MultiUserDisplayProps {
	participants: JamParticipant[];
}

interface ParticipantWithTrack extends JamParticipant {
	track?: Track;
	trackLoading?: boolean;
}

export default function MultiUserDisplay({ participants }: MultiUserDisplayProps) {
	const { data: session } = useSession();
	const [participantsWithTracks, setParticipantsWithTracks] = useState<ParticipantWithTrack[]>([]);
	const [trackCache, setTrackCache] = useState<Map<string, Track>>(new Map());

	// Fetch track details from Spotify when participants change
	useEffect(() => {
		const fetchTrackDetails = async () => {
			console.log("[MultiUserDisplay] Fetching track details for participants:", participants.map(p => ({
				user_name: p.user_name,
				spotify_track_id: p.spotify_track_id,
				is_playing: p.is_playing
			})));

			if (!session?.user?.accessToken) {
				console.log("[MultiUserDisplay] No access token available");
				return;
			}

			const accessToken = session.user.accessToken;
			const sdk = SpotifyApi.withAccessToken(
				process.env.NEXT_PUBLIC_AUTH_SPOTIFY_ID as string,
				accessToken
			);

			const updatedParticipants: ParticipantWithTrack[] = [];

			for (const participant of participants) {
				const participantWithTrack: ParticipantWithTrack = { ...participant };

				if (participant.spotify_track_id) {
					console.log(`[MultiUserDisplay] Processing participant ${participant.user_name} with track ID: ${participant.spotify_track_id}`);

					// Check cache first
					if (trackCache.has(participant.spotify_track_id)) {
						console.log(`[MultiUserDisplay] Cache hit for track: ${participant.spotify_track_id}`);
						participantWithTrack.track = trackCache.get(participant.spotify_track_id);
					} else {
						// Fetch from Spotify
						console.log(`[MultiUserDisplay] Cache miss, fetching from Spotify: ${participant.spotify_track_id}`);
						participantWithTrack.trackLoading = true;
						try {
							const track = await sdk.tracks.get(participant.spotify_track_id);

							// Validate track data
							if (!track || !track.id) {
								console.warn(`[MultiUserDisplay] Invalid track data received for ${participant.spotify_track_id}`);
								participantWithTrack.track = undefined;
							} else {
								console.log(`[MultiUserDisplay] Successfully fetched track:`, {
									id: track.id,
									name: track.name,
									artists: track.artists?.map(a => a.name) || []
								});
								participantWithTrack.track = track;

								// Update cache
								setTrackCache(prev => new Map(prev.set(participant.spotify_track_id!, track)));
							}
						} catch (error) {
							console.error(`[MultiUserDisplay] Error fetching track ${participant.spotify_track_id}:`, {
								error,
								message: error instanceof Error ? error.message : 'Unknown error',
								participant: participant.user_name
							});

							// Set track to undefined on error
							participantWithTrack.track = undefined;
						}
						participantWithTrack.trackLoading = false;
					}
				} else {
					console.log(`[MultiUserDisplay] Participant ${participant.user_name} has no track ID`);
				}

				updatedParticipants.push(participantWithTrack);
			}

			console.log("[MultiUserDisplay] Final participants with tracks:", updatedParticipants.map(p => ({
				user_name: p.user_name,
				hasTrack: !!p.track,
				trackName: p.track?.name,
				trackLoading: p.trackLoading
			})));

			setParticipantsWithTracks(updatedParticipants);
		};

		fetchTrackDetails();
	}, [participants, session, trackCache]);

	const ParticipantCard = ({ participant }: { participant: ParticipantWithTrack }) => {
		const albumCover = participant.track?.album?.images?.[0]?.url;
		const artistNames = participant.track?.artists?.map(artist => artist.name).join(", ");

		return (
			<div className="bg-zinc-900/60 backdrop-blur-md rounded-xl p-6 shadow-[0_0_30px_rgba(22,163,74,0.3)] min-w-[400px]">
				<div className="flex items-center gap-4 mb-4">
					{participant.user_avatar && (
						<Image
							src={participant.user_avatar}
							alt={participant.user_name}
							width={40}
							height={40}
							className="rounded-full"
						/>
					)}
					<div>
						<div className="text-white font-medium">{participant.user_name}</div>
						<div className="text-zinc-400 text-sm">
							{participant.is_playing ? "🎵 Playing" : "⏸ Paused"}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-4">
						<div className="w-24 h-24 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
							{albumCover ? (
								<Image
									src={albumCover}
									alt={`${participant.track?.album?.name} album cover`}
									className="w-full h-full object-cover"
									width={96}
									height={96}
								/>
							) : participant.trackLoading ? (
								<div className="w-full h-full bg-zinc-700 animate-pulse rounded-lg"></div>
							) : (
								<span className="text-zinc-500 text-sm text-center">No track</span>
							)}
						</div>
					</div>
					<div className="col-span-8">
						{participant.trackLoading ? (
							<div className="space-y-2">
								<div className="h-6 bg-zinc-700 rounded animate-pulse"></div>
								<div className="h-4 bg-zinc-700 rounded animate-pulse w-3/4"></div>
								<div className="h-4 bg-zinc-700 rounded animate-pulse w-1/2"></div>
							</div>
						) : participant.track ? (
							<>
								<h3 className="text-white text-lg font-bold mb-1 truncate">
									{participant.track.name}
								</h3>
								<p className="text-zinc-400 text-sm truncate">
									{artistNames}
								</p>
								<p className="text-zinc-500 text-xs truncate mt-1">
									{participant.track.album.name}
								</p>
							</>
						) : (
							<div className="text-zinc-400 text-sm">
								Not currently playing
							</div>
						)}
					</div>
				</div>
			</div>
		);
	};

	if (participantsWithTracks.length === 0) {
		return (
			<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-zinc-900/60 backdrop-blur-md rounded-xl">
				<div className="text-white text-xl">No participants in this jam yet...</div>
			</div>
		);
	}

	if (participantsWithTracks.length === 1) {
		// Single participant - center it like the original NowPlaying
		return (
			<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<ParticipantCard participant={participantsWithTracks[0]} />
			</div>
		);
	}

	// Multiple participants - grid layout
	return (
		<div className="fixed inset-0 p-20 overflow-auto">
			<div className="min-h-full flex items-center justify-center">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
					{participantsWithTracks.map((participant) => (
						<ParticipantCard key={participant.id} participant={participant} />
					))}
				</div>
			</div>
		</div>
	);
}