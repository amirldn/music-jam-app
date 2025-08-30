
import { auth } from "../auth"
import { SpotifyApi, AccessToken } from "@spotify/web-api-ts-sdk";

const clientId = process.env.SPOTIFY_CLIENT_ID;

export default async function NowPlaying() {
    const session = await auth()
    if (!session?.user) { return <div>Please sign in to see your now playing.</div> }

    if (!clientId) { return <div>Missing Spotify Client ID - something went really wrong.</div>; }

    // I might need to set up server-side here - https://github.com/spotify/spotify-web-api-ts-sdk?tab=readme-ov-file#mixed-server-and-client-side-authentication
    const sdk = SpotifyApi.withUserAuthorization(clientId, "https://localhost:3000", ["scope1", "scope2"]);
    const nowPlaying = await sdk.player.getCurrentlyPlayingTrack();
    console.log(nowPlaying);

    return (
        <div>
            {
                //     { nowPlaying?.item
                //         ? <div>Now playing: {nowPlaying.item.name}</div>
                //         : <div>Nothing is playing right now.</div>
                // } 

            }

        </div>
    );
}