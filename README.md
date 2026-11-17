# CineShelf

A Netflix-inspired MVP with a fresh React + Vite client, an Express API, MongoDB/Mongoose, bcrypt password hashing, JWT sign-in, and a private watchlist. The eight sample movie records are written by hand and inserted with a seed script; no movie API is used.

## 1. Install

Run these from the project root:

```powershell
npm install
npm install --prefix client
npm install --prefix server
```

## 2. Connect MongoDB

Copy `server/.env.example` to `server/.env`. Set `MONGO_URI` to your MongoDB connection string and replace `JWT_SECRET` with a long private value. Keep `server/.env` on your computer and out of GitHub.

For a local database, the example URI points to `mongodb://127.0.0.1:27017/cineshelf`. For MongoDB Atlas, use the connection string from your Atlas cluster and allow your development machine in Atlas Network Access.

## 3. Add the hand-authored sample movies

```powershell
npm run seed
```

The seed script inserts or updates eight sample records by slug, so rerunning it does not create duplicates.

## 4. Run and verify

```powershell
npm run dev
```

- Client: `http://localhost:5173`
- API health and database status: `http://localhost:5000/api/health`

The health response should show `"database":"connected"`. Create an account in the app, browse movies, and use **My List** to save titles. The client production build can be checked with `npm run build`.

## API routes

- `POST /api/auth/register` and `POST /api/auth/login`
- `GET /api/auth/me` (signed-in user)
- `GET /api/movies` and `GET /api/movies/:id`
- `GET /api/watchlist`, `POST /api/watchlist/:movieId`, and `DELETE /api/watchlist/:movieId` (signed in)

See [API_GUIDE.md](API_GUIDE.md) for hands-on `fetch()` examples and how the JWT protects each user's list.

## GitHub, Vercel, and Render deployment

Keep the client and API in one GitHub repository, then:

1. Create a Vercel project from the repository with Root Directory `client`. Vercel detects Vite and builds `dist`.
2. Create a MongoDB Atlas cluster and database user. Add the Render service's outbound IP ranges to the Atlas IP access list, then copy the Atlas connection string.
3. Create a Render Blueprint from the repository. The root `render.yaml` creates the Express API service and asks for `MONGO_URI`; Render generates `JWT_SECRET`.
4. After both services are deployed, set `CLIENT_URL` in Render to the Vercel site origin.
5. Set `VITE_API_URL` in Vercel to the Render API URL ending in `/api`, then redeploy the frontend.

Render's free web service sleeps after 15 minutes without traffic and may take about a minute to wake. Its outbound IP ranges are shared by services in the same region; copy the ranges shown under the API service's **Connect → Outbound** section into Atlas rather than allowing every IP. Keep secrets in host environment variables, never in GitHub. See the official [Render Blueprint guide](https://render.com/docs/blueprint-spec), [Render outbound IP guide](https://render.com/docs/outbound-ip-addresses), [Vercel Vite guide](https://vercel.com/docs/frameworks/frontend/vite), and [MongoDB Atlas connection guide](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/).
