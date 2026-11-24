# Roamly

Roamly is a full-stack travel planner for creating trips, organizing daily activities, tracking planned versus actual spending, searching places, storing travel documents, and getting AI-powered itinerary help.

## Features

- Create, update, and delete trips and timeline activities.
- Keep activities in chronological order with addresses, coordinates, costs, ratings, and notes.
- Calculate budget totals, actual spend, variance, remaining budget, projected remaining budget, and over-budget status on the server.
- Upload, download, and delete travel PDFs and images through MongoDB GridFS.
- Search and resolve real place information and coordinates through Geoapify.
- Generate a preview-only day-wise itinerary with Groq AI; activities are saved only after the user explicitly adds them.
- Use a context-aware travel co-pilot that reads the selected trip's schedule and live budget metrics.

## Why Geoapify instead of Google Maps and Places?

Google Maps and Google Places are powerful services, but they require billing setup and can incur usage costs. Roamly uses Geoapify for place search and geocoding because its free tier is suitable for an assessment or small project, supports autocomplete and place lookup, and keeps the provider key on the backend.

Geoapify does not consistently provide review ratings. Roamly therefore preserves a provider rating when available and supports an optional user rating for destination cards.

## Requirements

- Node.js 20 or later
- A MongoDB Atlas account and database
- A Geoapify API key
- A Groq API key

You must create and supply your own MongoDB URI and API keys. They are not included in this repository and must never be committed.

## Setup

Install dependencies for both applications:

```powershell
cd backend
npm install
cd ../frontend
npm install
```

Create the backend environment file:

```powershell
cd ../backend
Copy-Item .env.example .env
```

Set these values in `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
GROQ_API_KEY=your_groq_key
GROQ_MODEL=openai/gpt-oss-20b
GEOAPIFY_API_KEY=your_geoapify_key
CORS_ORIGIN=http://localhost:5173
```

### MongoDB Atlas checklist

1. Create a database user and copy the connection string from Atlas **Connect → Drivers**.
2. Replace the placeholders in `MONGODB_URI` with your own database user, password, cluster host, and database name.
3. In Atlas **Network Access**, allow your current public IP address while developing.
4. Keep `.env` private. It is ignored by Git.

## Run locally

Start the API in one terminal:

```powershell
cd backend
npm run dev
```

Start the web application in another terminal:

```powershell
cd frontend
npm run dev
```

Open `http://localhost:5173`. The frontend uses `http://localhost:5000/api/v1` by default. To point it at another API host, create `frontend/.env.local` with:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## API overview

| Area | Endpoints |
| --- | --- |
| Health | `GET /api/v1/health` |
| Trips | `GET, POST /api/v1/trips`; `GET, PUT, DELETE /api/v1/trips/:id` |
| Activities | `POST /api/v1/trips/:tripId/activities`; `PUT, DELETE /api/v1/trips/:tripId/activities/:activityId` |
| Documents | `POST /api/v1/trips/:tripId/documents`; `GET /api/v1/trips/:tripId/documents/:fileId/download`; `DELETE /api/v1/trips/:tripId/documents/:fileId` |
| Places | `GET /api/v1/places/search?query=...&destination=...`; `GET /api/v1/places/details/:placeId` |
| AI | `POST /api/v1/ai/generate-itinerary`; `POST /api/v1/ai/chat` |

All API responses use this envelope:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

## Document rules

Documents are stored in MongoDB GridFS in the `travel_docs` bucket. Uploads accept PDF, PNG, JPEG, and WebP files up to 10 MB.

## Tests and build

Run backend tests:

```powershell
cd backend
npm test
```

Build the frontend:

```powershell
cd frontend
npm run build
```

## Security and data handling

- Environment secrets stay in ignored `.env` files.
- The API uses CORS, Helmet security headers, request validation, a 1 MB JSON request limit, and strict document MIME/size validation.
- Budget calculations are computed server-side and are never stored as static totals.
- `actualCost: null` means unrecorded; `actualCost: 0` means a confirmed free activity.
