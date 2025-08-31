import { DefaultSession } from "next-auth";
import { AccessToken } from "@spotify/web-api-ts-sdk";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's Spotify access token object */
      accessToken?: AccessToken
    } & DefaultSession["user"]
  }
  
  interface JWT {
    /** The user's Spotify access token string */
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's Spotify access token string */
    accessToken?: string
  }
}
