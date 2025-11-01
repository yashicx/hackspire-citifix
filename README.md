# CitiFix Backend (Full)

This is a Node.js + Express backend for the CitiFix 2.0 project.
Features:
- Create issues with image upload (Multer)
- Persistent storage with MongoDB (Mongoose)
- Upvote endpoints
- Auto-post to Twitter/X when an issue crosses an upvote threshold
- Simple safety checks to avoid duplicate posts

## Quick start

1. Clone / download
2. Install dependencies:
   ```
   npm install
   ```
3. Create `.env` from `.env.example` and fill credentials (Mongo URI, Twitter API keys)
4. Run server:
   ```
   npm run dev
   ```
5. API endpoints:
   - `POST /api/issues/create` - form-data: `image` (file), `description` (text)
   - `POST /api/issues/:id/upvote` - increments upvotes and may trigger Twitter post

## Notes
- Keep your Twitter keys secret. Do not commit `.env`.
- The uploads folder is served statically at `/uploads`.
- For production, serve uploads from cloud storage (S3/GCS/Firebase) and secure the API.
