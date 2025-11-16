import { Request, Response } from "express";
import { User } from "../entities/User";
import { hash, compare } from "../utils/hash";
import { AppDataSource } from "../config/database";
import { generateToken } from "../middleware/auth";
import { successResponse, errorResponse } from "../utils/apiResponse";

const TOKEN_DURATION = "4h";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { username } });
    if (!user) return errorResponse(res, "Usuario no encontrado", 401);

    const valid = await compare(password, user.password);
    if (!valid) return errorResponse(res, "Contraseña incorrecta", 401);

    const token = generateToken({ id: user.id, username: user.username }, TOKEN_DURATION);

    return successResponse(res, "Usuario logeado correctamente", { token, expiresIn: TOKEN_DURATION });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error en el servidor", 500);
  }
};


export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOne({ where: { username } });
    if (existing) return errorResponse(res, "Usuario ya existe", 400);

    const hashedPassword = await hash(password);
    const newUser = userRepo.create({ username, password: hashedPassword });
    await userRepo.save(newUser);

    
    return successResponse(res, "Usuario creado correctamente", null, 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error en el servidor", 500);
  }
};
