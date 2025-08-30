"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MusicVisualizer from "@/components/visualizer/MusicVisualizer";
import { getCurrentTrack } from "@/lib/spotify";
import { SpotifyTrack } from "@/lib/spotify";

export default function VisualizerContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch current track data
  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchCurrentTrack = async (isInitialFetch = false) => {
      try {
        if (isInitialFetch) {
          setLoading(true);
        }
        setError(null);

        const response = await getCurrentTrack(session.accessToken!);

        if (response) {
          setCurrentTrack(response.item);
          setIsPlaying(response.is_playing);
        } else {
          setCurrentTrack(null);
          setIsPlaying(false);
        }
      } catch (err) {
        setError("Failed to fetch current track");
        console.error("Error fetching track:", err);
      } finally {
        if (isInitialFetch) {
          setLoading(false);
        }
      }
    };

    // Initial fetch with loading
    fetchCurrentTrack(true);

    // Poll for updates every 5 seconds without loading
    const interval = setInterval(() => fetchCurrentTrack(false), 5000);

    return () => clearInterval(interval);
  }, [session?.accessToken]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading your music...</p>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-6 max-w-md">
              <p className="text-white text-lg mb-4">Something went wrong</p>
              <p className="text-gray-300 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <MusicVisualizer track={currentTrack} isPlaying={isPlaying} />
      )}
    </div>
  );
}
