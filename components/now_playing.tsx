
import { auth } from "../auth"
import { SpotifyApi } from "@spotify/web-api-ts-sdk";



export default async function NowPlaying() {
    const session = await auth()
    if (!session) {
        return <div>No active session - please sign in to see your now playing.</div>
    }
    if (!session.user) { return <div>Unable to fetch user profile - something went really wrong.</div>; }
    console.log("User:", session.user);

    if (!session.user.accessToken) { return <div>No access token available - something went really wrong</div>; }
    console.log("Access Token:", session.user.accessToken);

    const sdk = SpotifyApi.withAccessToken("3e2088ff545f49d38963e602db5d68bb", session.user.accessToken);

    console.log("Session:", session);
    console.log('sdk:', sdk);
    var search = await sdk.currentUser.followedArtists();
    console.log('search:', search);

    // if (!clientId) { return <div>Missing Spotify Client ID - something went really wrong.</div>; }
    // const user = await sdk.currentUser.profile()
    // if (!user) { return <div>Unable to fetch user profile - something went really wrong.</div>; }
    // console.log("User profile:", user);


    if (!session?.user) {
        return <div>Please sign in to see your now playing.</div>
    }

    if (!session.user.accessToken) {
        return <div>No access token available. Please sign in again.</div>
    }

    try {
        // Initialize the SDK with the access token object from the session
        // const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, session.user.accessToken);

        // Get the currently playing track
        const nowPlaying = await sdk.player.getCurrentlyPlayingTrack();

        return (
            <div>
                {nowPlaying?.item
                    ? <div>Now playing: {nowPlaying.item.name}</div>
                    : <div>Nothing is playing right now.</div>
                }
            </div>
        );
    } catch (error) {
        console.error('Error fetching currently playing track:', error);
        return <div>Error fetching currently playing track. Please try again.</div>
    }
}