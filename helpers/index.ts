import jwt from "jsonwebtoken";

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const generateJWT = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}