"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginButton from "@/components/auth/LoginButton";

export default function HomeContent() {
  const { status } = useSession();
  const router = useRouter();

  // Redirect to visualizer if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/visualizer");
    }
  }, [status, router]);

  // Don't render anything while checking authentication
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

  // Don't render if authenticated (will redirect)
  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl mx-auto">
        {/* Logo/Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
            🎵 Music Jam
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
            Connect with Spotify and experience your music with stunning visualizations
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold text-white mb-2">Beautiful Visuals</h3>
            <p className="text-gray-300 text-sm">
              Stunning real-time visualizations that react to your music
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-lg font-semibold text-white mb-2">Spotify Integration</h3>
            <p className="text-gray-300 text-sm">
              Seamlessly connect with your Spotify account
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-300 text-sm">
              Join jam sessions with friends and share music experiences
            </p>
          </div>
        </div>

        {/* Login Section */}
        <div className="mb-8">
          <LoginButton />
        </div>

        {/* Footer */}
        <div className="text-gray-400 text-sm">
          <p>Phase 1: Core Login + Visualizer</p>
          <p className="mt-1">Built with Next.js, NextAuth.js, and p5.js</p>
        </div>
      </div>
    </div>
  );
}
