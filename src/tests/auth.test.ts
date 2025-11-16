// src/tests/auth.test.ts
import request from "supertest";
import { app } from "../index";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import * as bcrypt from "bcryptjs";

const mockUser = {
  id: "1",
  username: "testuser",
  password: bcrypt.hashSync("password123", 10), 
};

jest.spyOn(AppDataSource, "getRepository").mockReturnValue({
  findOne: jest.fn().mockImplementation(({ where: { username } }) => {
    if (username === mockUser.username) return Promise.resolve(mockUser);
    return Promise.resolve(null);
  }),
  create: jest.fn().mockImplementation((data) => data),
  save: jest.fn().mockImplementation((data) => ({ ...data, id: "2" })),
} as any);

describe("AuthController", () => {

  it("Debe registrar un usuario correctamente", async () => {
    const newUser = { username: "nuevoUser", password: "pass123" };
    const res = await request(app)
      .post("/auth/register")
      .send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined(); 
  });

  it("Debe retornar 401 con usuario incorrecto", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "noexist", password: "123" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Usuario no encontrado");
  });

  it("Debe logear correctamente con usuario correcto", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined(); 
  });

  it("Debe retornar 401 si la contraseña es incorrecta", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "wrongpass" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Contraseña incorrecta");
  });

});
