# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 collaborative music jamming application that integrates with Spotify. The app allows users to authenticate with Spotify and displays their currently playing track in real-time. Users can create and join music jams to see what everyone in the group is listening to simultaneously.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Architecture

### Authentication System
- Uses Next.js Auth.js (v5 beta) for authentication
- Primary auth configuration in `/auth.ts` and `/src/app/auth.ts` (duplicate files)
- Spotify OAuth provider configured with scopes: `user-read-email user-read-currently-playing`
- Custom session/JWT handling to include Spotify access tokens
- Middleware protection via `/middleware.ts`

### Key Components
- `/components/now_playing.tsx` - Real-time Spotify playback display with polling every 5 seconds (solo mode)
- `/components/jam_session.tsx` - Main component that handles solo vs collaborative mode based on URL parameters
- `/components/collaborative_jam.tsx` - Handles multi-user jam sessions with real-time updates
- `/components/multi_user_display.tsx` - Displays all participants and their current tracks in a grid layout
- `/components/jam_creator.tsx` - Modal for creating new music jams
- `/components/sign_in.tsx` - Authentication sign-in component
- `/components/sign_out.tsx` - Authentication sign-out component
- `/components/user_avatar.tsx` - User profile display

### Spotify Integration
- Uses `@spotify/web-api-ts-sdk` for Spotify Web API calls
- Access tokens stored in Next.js sessions
- Currently playing track fetched via `sdk.player.getCurrentlyPlayingTrack()`
- TODO items noted in auth.ts for refresh token implementation

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL) for jam sessions and real-time updates
- **UI**: TailwindCSS v4 for styling
- **Authentication**: Next.js Auth.js v5 beta
- **Spotify API**: @spotify/web-api-ts-sdk
- **Icons**: react-icons
- **Build**: Turbopack for development and production

### Project Structure
- `/src/app/` - Next.js App Router pages and layouts
- `/components/` - Reusable React components
- `/auth.ts` - Main authentication configuration
- `/middleware.ts` - Next.js middleware for route protection

### Environment Variables Required
- `NEXT_PUBLIC_AUTH_SPOTIFY_ID` - Spotify Client ID (used in client components)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- Additional Spotify credentials needed for NextAuth configuration

### Collaborative Features
- **Jam Creation**: Users can create music jams with shareable 6-character codes
- **Real-time Sync**: Uses Supabase real-time subscriptions to sync participant data
- **Track ID Approach**: Only Spotify track IDs are shared (not full track data) for efficiency and security
- **Multi-user Display**: Responsive grid layout showing all participants and their current tracks
- **URL-based Joining**: Users join jams via `/?jam=XXXXXX` URL parameter

### Development Notes
- Uses TypeScript with strict mode enabled
- ESLint configured via `eslint-config-next`
- Path aliases configured: `@/*` maps to `./src/*`
- Duplicate auth files exist - consider consolidating during development