import { auth } from "@/app/auth";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export default async function NowPlaying() {
    if (!process.env.AUTH_SPOTIFY_ID) {
        console.log("No Spotify client ID configured");
    }
    const session = await auth();
    if (!session) {
        return (
            <div>No active session - please sign in to see your now playing.</div>
        );
    }
    if (!session.user.accessToken) {
        return <div>No access token available - something went really wrong</div>;
    }

    const sdk = SpotifyApi.withAccessToken(
        process.env.AUTH_SPOTIFY_ID as string,
        session.user.accessToken
    );

    if (!session?.user) {
        return <div>Please sign in to see your now playing.</div>;
    }

    const nowPlaying = await sdk.player.getCurrentlyPlayingTrack();

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
