import jwt from "jsonwebtoken";

export default function authenticate(request, response, next) {
  const token = request.headers.authorization?.startsWith("Bearer ")
    ? request.headers.authorization.slice(7)
    : null;

  if (!token) return response.status(401).json({ message: "Please sign in to continue." });
  if (!process.env.JWT_SECRET) return response.status(503).json({ message: "JWT_SECRET is missing from server/.env." });

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    response.status(401).json({ message: "Your session has expired. Please sign in again." });
  }
}
