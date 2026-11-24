# Roamly Backend

Express and MongoDB API for Roamly's travel-planning application. The frontend consumes every endpoint under `/api/v1` and receives `{ success, data, message }` response envelopes.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI`, `GEOAPIFY_API_KEY`, and `GROQ_API_KEY`.
3. Run `npm install` and `npm run dev`.

`MONGODB_URI` is required to start the application. Geoapify and Groq are required only when their respective routes are used.

## API

| Area | Endpoints |
| --- | --- |
| Health | `GET /api/v1/health` |
| Trips | `GET, POST /api/v1/trips`; `GET, PUT, DELETE /api/v1/trips/:id` |
| Activities | `POST /api/v1/trips/:tripId/activities`; `PUT, DELETE /api/v1/trips/:tripId/activities/:activityId` |
| Documents | `POST /api/v1/trips/:tripId/documents`; `GET /api/v1/trips/:tripId/documents/:fileId/download`; `DELETE /api/v1/trips/:tripId/documents/:fileId` |
| Places | `GET /api/v1/places/search?query=...&destination=...`; `GET /api/v1/places/details/:placeId` |
| AI | `POST /api/v1/ai/generate-itinerary`; `POST /api/v1/ai/chat` |

## Data and safeguards

- MongoDB stores a trip with embedded, backend-sorted activities and document references.
- Budget metrics are computed for every response and are never persisted as totals.
- `actualCost: null` means unrecorded, while `actualCost: 0` means confirmed free.
- Documents accept PDF, PNG, JPEG, and WebP only, with a 10 MB limit; file bytes stream to the `travel_docs` GridFS bucket.
- Deleting a trip removes its referenced GridFS files.
- Geoapify results are normalized and cached in memory for five minutes. Attribution must be displayed by the frontend.
- Generated itineraries are validated with Zod and are preview-only; only the activity endpoint persists an activity after user confirmation.

## Verification

Run `npm test` for budget and chronological-sort checks. Integration tests that touch MongoDB need an Atlas connection that resolves from the host network.
