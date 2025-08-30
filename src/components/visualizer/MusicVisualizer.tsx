
"use client";

import { useEffect, useRef, useState } from "react";
import { SpotifyTrack } from "@/lib/spotify";

interface MusicVisualizerProps {
  track: SpotifyTrack | null;
  isPlaying: boolean;
}

export default function MusicVisualizer({ track, isPlaying }: MusicVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Canvas animation
  useEffect(() => {
    if (!canvasRef.current || !isClient) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    let time = 0;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
    }> = [];

    const animate = () => {
      time += 0.016; // 60fps

      // Clear canvas
      ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create animated gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `hsl(${240 + Math.sin(time) * 20}, 70%, 20%)`);
      gradient.addColorStop(1, `hsl(${280 + Math.cos(time) * 20}, 70%, 30%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add particles when playing
      if (isPlaying && Math.random() < 0.1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1,
          size: Math.random() * 3 + 1,
        });
      }

      // Update and draw particles
      particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;

        if (particle.life > 0) {
          ctx.save();
          ctx.globalAlpha = particle.life;
          ctx.fillStyle = `hsl(${200 + Math.sin(time * 2) * 60}, 80%, 70%)`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          return true;
        }
        return false;
      });

      // Draw album art if available
      if (track?.album.images[0]?.url) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Draw pulsing circle behind album art
        const pulseSize = isPlaying ? 120 + Math.sin(time * 2) * 20 : 120;
        ctx.strokeStyle = `rgba(255, 255, 255, ${isPlaying ? 0.3 : 0.1})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
        ctx.stroke();

        // Draw album art placeholder (circle for now)
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [track, isPlaying, dimensions, isClient]);

  if (!isClient) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading visualizer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />

      {/* Song Info Overlay */}
      {track && (
        <div className="absolute bottom-8 left-8 right-8 text-white z-10">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-2 truncate">{track.name}</h2>
            <p className="text-lg text-gray-200 mb-1 truncate">
              {track.artists.map(artist => artist.name).join(", ")}
            </p>
            <p className="text-sm text-gray-300 truncate">{track.album.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
