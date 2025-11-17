import { Response } from "express";
import { Caso } from "../entities/Caso";
import { AppDataSource } from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { successResponse, errorResponse } from "../utils/apiResponse";


export const getCasos = async (req: AuthRequest, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Caso);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [casos, total] = await repo.findAndCount({
      where: { activo: true },
      skip,
      take: limit,
      order: { nombre: "ASC" }
    });

    return successResponse(res, "Casos obtenidos correctamente", {
      data: casos,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error al obtener los casos", 500);
  }
};
export const getCasoById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Caso);

    // Buscar por ID primero
    const caso = await repo.findOne({ where: { id } });
    if (!caso || !caso.activo) {
      return errorResponse(res, "Caso no encontrado", 404);
    }

    return successResponse(res, "Caso obtenido correctamente", caso);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error al obtener el caso", 500);
  }
};




export const createCaso = async (req: AuthRequest, res: Response) => {
  try {
    const { nombre, descripcion, estado } = req.body;

    if (!nombre || !descripcion || !estado) {
      return errorResponse(res, "Todos los campos son obligatorios", 400);
    }

    const repo = AppDataSource.getRepository(Caso);
    const newCaso = repo.create({ nombre, descripcion, estado });
    await repo.save(newCaso);

    return successResponse(res, "Caso creado correctamente", newCaso, 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error al crear el caso", 500);
  }
};

export const updateCaso = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Caso);

    const caso = await repo.findOne({ where: { id, activo: true } });
    if (!caso) return errorResponse(res, "Caso no encontrado", 404);

    repo.merge(caso, req.body);
    await repo.save(caso);

    return successResponse(res, "Caso actualizado correctamente", caso);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error al actualizar el caso", 500);
  }
};


export const deleteCaso = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Caso);

    const caso = await repo.findOne({ where: { id, activo: true } });
    if (!caso) return errorResponse(res, "Caso no encontrado", 404);

    caso.activo = false;
    await repo.save(caso);

    return successResponse(res, "Caso eliminado correctamente");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error al eliminar el caso", 500);
  }
};
