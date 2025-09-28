import SignIn from "@/components/sign_in";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
			{/* Hero Section */}
			<div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
				<div className="max-w-4xl mx-auto">
					{/* Logo/Title */}
					<div className="mb-8">
						<h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
							Music Jam
						</h1>
						<p className="text-xl md:text-2xl text-zinc-300 font-light">
							Share your music taste in real-time with friends
						</p>
					</div>

					{/* Features */}
					<div className="grid md:grid-cols-3 gap-8 mb-12 text-left">
						<div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700/50">
							<div className="text-3xl mb-4">🎵</div>
							<h3 className="text-lg font-semibold mb-2 text-green-400">Real-time Sync</h3>
							<p className="text-zinc-400 text-sm">
								See what your friends are listening to on Spotify as it happens
							</p>
						</div>

						<div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700/50">
							<div className="text-3xl mb-4">🤝</div>
							<h3 className="text-lg font-semibold mb-2 text-green-400">Collaborative Sessions</h3>
							<p className="text-zinc-400 text-sm">
								Create or join music jams with shareable codes
							</p>
						</div>

						<div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700/50">
							<div className="text-3xl mb-4">🎧</div>
							<h3 className="text-lg font-semibold mb-2 text-green-400">Discover Together</h3>
							<p className="text-zinc-400 text-sm">
								Experience music discovery with friends across the globe
							</p>
						</div>
					</div>

					{/* Call to Action */}
					<div className="space-y-4">
						<div className="text-zinc-400 text-sm">
							Connect your Spotify account to get started
						</div>
						<SignIn />
					</div>
				</div>

				{/* Floating Music Notes Animation */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-1/4 left-1/4 text-green-500/20 text-4xl animate-pulse">♪</div>
					<div className="absolute top-1/3 right-1/4 text-green-400/20 text-3xl animate-pulse animation-delay-1000">♫</div>
					<div className="absolute bottom-1/3 left-1/3 text-green-600/20 text-5xl animate-pulse animation-delay-2000">♪</div>
					<div className="absolute bottom-1/4 right-1/3 text-green-500/20 text-2xl animate-pulse animation-delay-500">♫</div>
				</div>
			</div>

			{/* Footer */}
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-zinc-500 text-xs">
				Powered by Spotify Web API
			</div>
		</div>
	);
}