# CineShelf API walkthrough

The app's movie data travels through four pieces:

```text
React fetch() → Vite /api proxy → Express route/controller → Mongoose → MongoDB
```

In development, React calls paths such as `/api/movies`. Vite forwards them to Express on port 5000. Express reads or changes MongoDB through Mongoose and sends JSON back to React. The shared request helper is in `client/src/services/api.js`.

## Fetch movies

In a React component, import the helper and load the hand-seeded catalog:

```js
import { apiRequest } from "../services/api.js";

const { movies } = await apiRequest("/movies");
console.log(movies);
```

The equivalent browser request is:

```js
const response = await fetch("/api/movies");
const { movies } = await response.json();
```

`GET /api/movies` returns `{ movies: [...] }`. Add a genre filter with `GET /api/movies?genre=Sci-Fi` or fetch one movie with `GET /api/movies/:id`.

## Register and sign in

Registration sends JSON to `POST /api/auth/register`:

```js
const result = await apiRequest("/auth/register", {
  method: "POST",
  body: JSON.stringify({ name, email, password }),
});
```

The server hashes the password with bcrypt and returns a signed JWT plus a safe user summary. Sign in uses the same pattern with `{ email, password }` at `/auth/login`. The app stores the token in browser local storage and sends it with protected requests. Never put the real password or token into a public repository or share it in chat.

## Use the protected watchlist

The browser sends the JWT in the `Authorization` header. The helper adds this header when you pass `token`:

```js
const { movies } = await apiRequest("/watchlist", { token });

await apiRequest(`/watchlist/${movieId}`, {
  token,
  method: "POST", // add
});

await apiRequest(`/watchlist/${movieId}`, {
  token,
  method: "DELETE", // remove
});
```

Without a valid token, the watchlist API returns HTTP `401`. Each saved list is linked to its owner in the `Watchlist` model, so one account cannot read another account's list.

## Routes and responsibilities

| Request | Purpose | Code |
| --- | --- | --- |
| `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | Account creation, sign-in, current user | `server/routes/authRoutes.js`, `server/controllers/authController.js` |
| `GET /api/movies`, `GET /api/movies/:id` | Read the manual catalog | `server/routes/movieRoutes.js`, `server/controllers/movieController.js` |
| `GET /api/watchlist`, `POST /api/watchlist/:movieId`, `DELETE /api/watchlist/:movieId` | Read, add, or remove saved movies | `server/routes/watchlistRoutes.js`, `server/controllers/watchlistController.js` |

The catalog records are in `server/seed.js`. Run `npm run seed` from the project root to upsert the eight records into MongoDB by slug.
