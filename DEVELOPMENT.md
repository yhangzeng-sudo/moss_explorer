# NUS Moss Explorer - Development Notes

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Default User

The app uses a default user ID (`default-user`) for demo purposes. In production, implement proper authentication.

## Image Storage

Currently, images are stored as base64 strings in JSON files. For production:
- Use cloud storage (AWS S3, Cloudinary, etc.)
- Store only URLs in the database
- Implement image compression and optimization

## Mock Data

The app initializes with:
- 3 official moss points (YIH, UTown, Central Library)
- 3 biomes (Shaded Wall, Drainage Line, Stone Surface)
- Empty user and post databases (created on first use)

## Testing the Flow

1. Visit `/post` to create your first moss discovery
2. View it in `/gallery`
3. See it on `/map`
4. Check your energy and growth on `/me`
5. Use "Take a Snapshot!" on any image in the gallery

## Customization

- **Locations**: Edit `NUS_LOCATIONS` in `/app/post/page.tsx`
- **Stickers**: Edit `STICKERS` arrays in components
- **Biomes**: Edit `/lib/db.ts` `getBiomes()` function
- **Moss Points**: Edit `/lib/db.ts` `getMossPoints()` function
- **Colors**: Edit `tailwind.config.js` moss color palette

