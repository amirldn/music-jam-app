
import { auth } from "../auth"
import { SpotifyApi, AccessToken } from "@spotify/web-api-ts-sdk";

const clientId = process.env.SPOTIFY_CLIENT_ID;

export default async function NowPlaying() {
    const session = await auth()
    if (!session?.user) { return <div>Please sign in to see your now playing.</div> }


    // const sdk = SpotifyApi.withAccessToken(clientId, token);
    // const nowPlaying = await sdk.player.getCurrentlyPlayingTrack();

    return (
        <div>
            {/* {nowPlaying?.item
                ? <div>Now playing: {nowPlaying.item.name}</div>
                : <div>Nothing is playing right now.</div>
            } */}
        </div>
    );
}