import connectDatabase from "./connectDatabase.js";

export default async function requireDatabase(_request, response, next) {
  try {
    await connectDatabase();
    next();
  } catch {
    response.status(503).json({ message: "Database is not connected. Check MONGO_URI and the database network access settings." });
  }
}
