import request from "supertest";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import app from "./../../../server/app.js";
import { connectDBTest } from "./../../../server/config/database.js";
import user from "../../../server/models/user.js";

let token;

describe("Users API", () => {
  beforeAll(async () => {
    dotenv.config();
    await connectDBTest();
    await user.deleteMany({});

    // Cria usuário admin de teste
    const hashedPassword = await bcrypt.hash('senhaSegura123', 10);
    await user.create({
      name: 'Admin Teste',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      language: 'pt-BR'
    });

 
    // Login para obter token
    const res = await request(app)
      .post('/login')
      .send({
        email: 'admin@example.com',
        password: 'senhaSegura123'
      });

      const decoded = JSON.parse(res.text);
   console.log('Admin de teste criado');
    console.log(res)
      console.log(decoded)

    token = decoded.data.token;
  });

  describe("POST /users - Cadastro de usuário", () => {
    it("Cadastro de usuário com sucesso", async () => {
      const res = await request(app)
        .post("/users")
        .send({ 
          name: "Usuário Teste", 
          email: "teste_sucesso@example.com", 
          password: "123456" 
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      expect(res.body).toMatchObject({
        statusCode: 201,
        data: {
          user: expect.any(Object),
          token: expect.any(String),
        },
        metadata: expect.any(Object),
      });
    });

    it("Cadastro de usuário com email inválido", async () => {
      await request(app)
        .post("/users")
        .send({ 
          name: "Usuário Inválido", 
          email: "email-invalido", 
          password: "123" 
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(422);
    });

    it("Cadastro de usuário com dados nulos", async () => {
      await request(app)
        .post("/users")
        .send({ 
          name: null, 
          email: null, 
          password: null 
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(422);
    });
  });

  describe("GET /users - Consulta de usuários", () => {
    it("Consulta de usuários com sucesso", async () => {
      const res = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("metadata");
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("Consulta de usuário com token inválido", async () => {
      await request(app)
        .get("/users")
        .set("Authorization", `Bearer INVALID_TOKEN`)
        .expect(401);
    });
  });

  describe("PUT /users/:id - Edição de usuário", () => {
    it("Edição de usuário com sucesso", async () => {
      // Criar usuário
      const newUser = await request(app)
        .post("/users")
        .send({ 
          name: "User Edit", 
          email: "edit@example.com", 
          password: "123456" 
        })
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      // Editar usuário
      const res = await request(app)
        .put(`/users/${newUser.body.data.user._id}`)
        .send({ name: "User Editado" })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body.data.name).toBe("User Editado");
    });

    it("Edição de usuário inexistente", async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'; // ObjectId válido mas inexistente
      await request(app)
        .put(`/users/${nonExistentId}`)
        .send({ name: "Novo Nome" })
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });

    it("Edição de usuário sem autenticação", async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app)
        .put(`/users/${nonExistentId}`)
        .send({ name: "Sem Permissão" })
        .expect(401);
    });
  });
});