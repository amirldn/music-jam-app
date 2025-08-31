import NextAuth, { type DefaultSession } from "next-auth"
import Spotify from "next-auth/providers/spotify"
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
  // TODO: add the default JWT interface back
}

  const scope = new URLSearchParams();
  scope.append("scope", "user-read-email user-read-currently-playing");

export const { handlers, signIn, signOut, auth } = NextAuth({

  providers: [
    // https://github.com/nextauthjs/next-auth/issues/11698 - improve this at some point
    Spotify({
      authorization: `https://accounts.spotify.com/authorize?scope=${encodeURIComponent('user-read-email user-read-currently-playing')}`,
    })
  ],

  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access token to the token right after signin
      if (account) {
        console.log ("Account:", account);
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token  }) {
      // Create the AccessToken object and add it to the session
      if (token.accessToken) {
        const accessToken: AccessToken = {
          access_token: token.accessToken as string,
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