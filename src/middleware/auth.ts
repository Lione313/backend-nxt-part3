import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET || "default-secret-key-change-this";

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET no definido en .env, usando valor por defecto (INSEGURO)");
}


export interface JwtPayloadData {
  id: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayloadData | JwtPayload;
}

export const verifyToken = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({ message: "Token no proporcionado" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Token inválido" });
      return;
    }

    const decoded = jwt.verify(token, SECRET) as JwtPayloadData;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verifyToken:", err);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const generateToken = (
  payload: JwtPayloadData,
  expiresIn = "4h"
): string => {
  return jwt.sign(payload, SECRET, { expiresIn } as jwt.SignOptions);
};