import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function sendUser(user, response, status = 200) {
  if (!process.env.JWT_SECRET) {
    return response.status(503).json({ message: "JWT_SECRET is missing from server/.env." });
  }
  const token = jwt.sign({ id: user._id.toString(), name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
  response.status(status).json({ token, user: { id: user._id, name: user.name, email: user.email } });
}

export async function register(request, response, next) {
  try {
    const { name, email, password } = request.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return response.status(400).json({ message: "Name, email, and password are required." });
    }
    if (password.length < 8) return response.status(400).json({ message: "Password must be at least 8 characters." });
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) return response.status(409).json({ message: "An account with that email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password: hashedPassword });
    sendUser(user, response, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body;
    if (!email?.trim() || !password) return response.status(400).json({ message: "Email and password are required." });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(401).json({ message: "Email or password is incorrect." });
    }
    sendUser(user, response);
  } catch (error) {
    next(error);
  }
}

export async function currentUser(request, response, next) {
  try {
    const user = await User.findById(request.user.id).select("name email");
    if (!user) return response.status(404).json({ message: "Account not found." });
    response.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
}
