# 🎵 Music Jam App

A web application that allows users to connect with Spotify and experience their music with stunning real-time visualizations. Built with Next.js, NextAuth.js, and p5.js.

## ✨ Features

### Phase 1: Core Login + Visualizer ✅
- **Spotify Authentication**: Secure login using NextAuth.js
- **Real-time Music Data**: Fetch currently playing track from Spotify Web API
- **Interactive Visualizer**: Beautiful p5.js-based visualizations that react to music
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Future Phases 🚀
- **Multi-User Jam Sessions**: Share rooms and see what friends are listening to
- **Apple Music Support**: Additional music platform integration
- **Advanced Visualizations**: Multiple visualizer modes and effects
- **Social Features**: Chat, reactions, and collaborative experiences

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Music API**: Spotify Web API
- **Visualization**: p5.js
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Spotify Developer Account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd music-jam-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add `http://localhost:3000/api/auth/callback/spotify` to Redirect URIs
4. Copy your Client ID and Client Secret

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Spotify API Base URL
SPOTIFY_API_BASE_URL=https://api.spotify.com/v1
```

**Note**: Generate a secure random string for `NEXTAUTH_SECRET`. You can use:
```bash
openssl rand -base64 32
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

1. **Home Page**: Visit the app and see the landing page
2. **Login**: Click "Connect with Spotify" to authenticate
3. **Visualizer**: After login, you'll be redirected to the music visualizer
4. **Music Display**: The app will show your currently playing track with beautiful visualizations

## 🔧 Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth.js routes
│   ├── visualizer/        # Visualizer page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── visualizer/        # Visualizer components
│   └── ui/                # Common UI components
├── lib/                    # Utility functions
│   ├── auth.ts            # NextAuth configuration
│   ├── spotify.ts         # Spotify API utilities
│   └── utils.ts           # General utilities
└── types/                  # TypeScript definitions
```

### Key Components

- **`MusicVisualizer`**: Main p5.js visualization component
- **`LoginButton`**: Spotify authentication component
- **`SessionProvider`**: NextAuth.js session context provider

### API Endpoints

- **`/api/auth/[...nextauth]`**: NextAuth.js authentication routes
- **`/visualizer`**: Main visualizer page (protected route)

## 🎨 Customization

### Visualizer Effects

The visualizer includes:
- Animated gradient backgrounds
- Particle systems
- Pulsing effects that respond to music state
- Album art integration

### Styling

The app uses Tailwind CSS with a custom color scheme. You can modify:
- Color gradients in the visualizer
- Component styling in individual component files
- Global styles in `globals.css`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🔒 Security

- **Environment Variables**: Never commit `.env.local` to version control
- **NextAuth.js**: Secure session management and token handling
- **Spotify API**: OAuth 2.0 flow with proper scopes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [p5.js](https://p5js.org/) - Creative coding library
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - Music data

## 📞 Support

If you encounter any issues:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Ensure your environment variables are correctly set

---

**Happy Jamming! 🎵✨**
