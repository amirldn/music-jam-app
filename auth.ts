import NextAuth, { type DefaultSession } from "next-auth"
import Spotify from "next-auth/providers/spotify"
import { AccessToken } from "@spotify/web-api-ts-sdk";
import { type DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's Spotify access token object */
      accessToken?: AccessToken
    } & DefaultSession["user"]
  }
  

}

declare module "next-auth/jwt" {
    interface JWT {
    /** The user's Spotify OAuth access token string */
    accessToken?: string & DefaultJWT["accessToken"]
  } 
}

export const { handlers, signIn, signOut, auth } = NextAuth({

  providers: [
    // https://github.com/nextauthjs/next-auth/issues/11698 - improve this scope
    Spotify({
      authorization: `https://accounts.spotify.com/authorize?scope=${encodeURIComponent('user-read-email user-read-currently-playing')}`,
    })
  ],

  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token  }) {
      // Create the AccessToken object and add it to the session
      if (token.accessToken) {
        const accessToken: AccessToken = {
          access_token: token.accessToken,
          // TODO: get rid of this string
          token_type: "Bearer",
          expires_in: 3600, // This will be updated when we implement refresh logic
          refresh_token: "", // We'll implement this later
        };
        session.user.accessToken = accessToken;
      }
      return session;
    },
  },
})