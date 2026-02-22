import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/models";
import type { UserCreationAttributes } from "../db/models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-change-in-production";
const SALT_ROUNDS = 10;

export async function register(email: string, password: string, name?: string) {
  const existing = await User.findOne({ where: { email: email.toLowerCase() } });
  if (existing) throw new Error("Email already registered");
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    name: name || null,
  } as UserCreationAttributes);
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) throw new Error("Invalid email or password");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password");
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
}
