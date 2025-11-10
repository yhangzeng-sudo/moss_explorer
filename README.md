# NUS Moss Explorer

A participatory web experience where students can discover, share, and explore moss findings around the NUS campus. Transform your 360° virtual tour into an interactive campus moss hunt!

## Features

- 🌿 **Moss Gallery**: Browse and filter moss discoveries by location and stickers
- 🗺️ **Interactive Map**: View moss discoveries and official moss points on a campus map
- 📸 **Post Your Discovery**: Upload photos, name your moss, and pin locations
- ⚡ **Energy System**: Collect energy from discoveries to unlock new biomes
- 🌱 **Growth Tracking**: Watch your moss ecosystem grow from Seed to Moss Forest
- 📷 **Take a Snapshot**: Capture and decorate images with stickers

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /api          # API routes
  /gallery      # Moss gallery page
  /map          # Interactive map page
  /post         # Post submission page
  /me           # User profile and growth page
/components     # Reusable components
/lib            # Database utilities
/types          # TypeScript type definitions
/data           # JSON data files (created at runtime)
```

## API Endpoints

- `GET /api/moss-posts` - List all moss posts (with optional filters)
- `POST /api/moss-posts` - Create a new moss post
- `GET /api/moss-posts/[id]` - Get a specific post
- `GET /api/moss-points` - List official moss points
- `GET /api/biomes` - List all biomes
- `GET /api/me` - Get user profile and energy
- `POST /api/me/claim` - Claim energy from a moss point

## Data Storage

The app uses a file-based JSON database stored in the `/data` directory. Files are created automatically on first run:

- `users.json` - User profiles
- `posts.json` - Moss post submissions
- `points.json` - Official moss points
- `biomes.json` - Biome definitions

## Growth Stages

- **Seed** (0-4 energy): Starting your moss journey
- **Sprouting Moss** (5-9 energy): Your first discoveries
- **Wall Patch** (10-14 energy): Growing collection
- **Moss Forest** (15+ energy): Master explorer!

## Integration with ThinkLink

To integrate with your 360° ThinkLink tour:

1. Add a button in your final ThinkLink scene linking to `/post` or `/gallery`
2. Optionally embed the ThinkLink iframe on any page
3. Use the "Take a Snapshot!" button component to capture decorated images

## Mobile Optimization

The app is designed mobile-first, optimized for students uploading photos from their phones.

## Future Enhancements

- Real authentication system
- Cloud image storage (currently using base64)
- Real NUS campus map integration
- Admin panel for managing official moss points
- Social features (likes, comments)

## License

MIT

