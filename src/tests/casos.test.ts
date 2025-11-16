// src/tests/casos.test.ts
import request from "supertest";
import { app } from "../index";
import { AppDataSource } from "../config/database";
import { Caso } from "../entities/Caso";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default-secret-key-change-this";

const mockUser = { id: "1", username: "testuser" };
const token = jwt.sign(mockUser, SECRET, { expiresIn: "1h" });

// Mock de casos
const mockCaso = {
  id: "1",
  nombre: "Caso Test",
  descripcion: "Descripción del caso",
  estado: "abierto",
  activo: true,
};

// Mock del repositorio
const mockRepo = {
  findAndCount: jest.fn().mockResolvedValue([[mockCaso], 1]),
  findOne: jest.fn().mockImplementation(({ where: { id } }) => {
    if (id === mockCaso.id && mockCaso.activo) return Promise.resolve(mockCaso);
    return Promise.resolve(null);
  }),
  create: jest.fn().mockImplementation((data) => ({ ...data, id: "2", activo: true })),
  save: jest.fn().mockResolvedValue(true),
  merge: jest.fn(),
  delete: jest.fn(),
};

jest.spyOn(AppDataSource, "getRepository").mockReturnValue(mockRepo as any);

describe("CasosController", () => {

  it("Debe retornar la lista de casos con JWT válido", async () => {
    const res = await request(app)
      .get("/casos")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(1);
  });

  it("Debe crear un caso nuevo", async () => {
    const newCaso = { nombre: "Nuevo Caso", descripcion: "Desc", estado: "abierto" };
    const res = await request(app)
      .post("/casos")
      .set("Authorization", `Bearer ${token}`)
      .send(newCaso);
    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe(newCaso.nombre);
  });

  it("Debe actualizar un caso existente", async () => {
    const updatedData = { nombre: "Caso Actualizado" };
    const res = await request(app)
      .put(`/casos/${mockCaso.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);
    expect(res.status).toBe(200);
  });

  it("Debe eliminar lógicamente un caso", async () => {
    const res = await request(app)
      .delete(`/casos/${mockCaso.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Caso eliminado (lógicamente)");
  });

  it("Debe retornar 401 si no hay JWT", async () => {
    const res = await request(app).get("/casos");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token no proporcionado");
  });

});
