// src/routes/casosRoutes.ts
import { Router } from "express";
import {
  getCasos,
   getCasoById,
  createCaso,
  updateCaso,
  deleteCaso,
} from "../controllers/casosController";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.use(verifyToken);

router.get("/", getCasos);

router.get("/:id", getCasoById); 

router.post("/", createCaso);

router.put("/:id", updateCaso);

router.delete("/:id", deleteCaso);

export default router;
