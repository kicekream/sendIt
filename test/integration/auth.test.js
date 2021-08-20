import request from "supertest";
const { Pool } = require("pg");
import pool from "../../src/database/modelIndex";
import {} from "dotenv/config";


import server from "../../src/index";

describe("/v1/auth", () => {
  beforeEach(async () => {
    await pool.query(`DROP TABLE IF EXISTS users CASCADE;
    CREATE TABLE IF NOT EXISTS users(
          user_id serial PRIMARY KEY,
          firstname VARCHAR(150) NOT NULL,
          lastname VARCHAR(150) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          createdat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          isAdmin BOOLEAN DEFAULT FALSE
      )`);

    await pool.query(`INSERT INTO 
    users (firstname, lastname, email, password) 
    VALUES 
    ('Asa', 'Olu', 'asaolu@gmail.com', '$2b$10$yWuGJUJpvogxY2hFKEOyYOwwDgEybuxkMJ.jkU/10DihrrOxkfVsy')`);
  });

  afterEach(async () => {
    await pool.query("DELETE FROM users WHERE user_id > 1");
  });

  afterAll(async () => {
    server.close();
    pool.end();
  });

  describe("POST /signup", () => {
    it("Should return 400 if firstname is absent", async () => {
      const res = await request(server).post("/v1/auth/signup").send({
        lastname: "segun",
        email: "olusegun@gmail.com",
        password: "12345",
      });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if firstname less than 2 characters", async () => {
      const res = await request(server).post("/v1/auth/signup").send({
        firstname: "a",
        lastname: "segun",
        email: "olusegun@gmail.com",
        password: "12345",
      });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if lastname is absent", async () => {
      const res = await request(server).post("/v1/auth/signup").send({
        firstname: "olu",
        email: "olusegun@gmail.com",
        password: "12345",
      });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if lastname is less than 2 characters", async () => {
      const res = await request(server).post("/v1/auth/signup").send({
        firstname: "olu",
        lastname: "s",
        email: "olusegun@gmail.com",
        password: "12345",
      });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if email field is absent", async () => {
      const res = await request(server).post("/v1/auth/signup").send({
        firstname: "olu",
        lastname: "segun",
        password: "12345",
      });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if email not a valid email", async () => {
      const res = await request(server).post("/v1/auth/signup").send({
        firstname: "olu",
        lastname: "segun",
        email: "olusegun",
        password: "12345",
      });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if password field is absent", async () => {
      const res = await request(server).post("/v1/auth/signup").send({
        firstname: "olu",
        lastname: "segun",
        email: "olusegun@gmail.com",
      });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if password is less than 2 characters", async () => {
      const res = await request(server).post("/v1/auth/signup").send({
        firstname: "olu",
        lastname: "segun",
        email: "olusegun@gmail.com",
        password: "1",
      });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if user already exists", async () => {
      const res = await request(server).post("/v1/auth/signup").send({
        firstname: "Asa",
        lastname: "Olu",
        email: "asaolu@gmail.com",
        password: "12345",
      });
      expect(res.status).toBe(400)
    });

    it("Should return 200 if user is succesfully created", async () => {
      const res = await request(server).post("/v1/auth/signup").send({
        firstname: "olu",
        lastname: "segun",
        email: "olusegun@gmail.com",
        password: "12345",
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        user_id: 2,
        email: "olusegun@gmail.com",
      });
    });
  });

  describe("POST /login", () => {
    it("Should return 400 if email is absent", async () => {
      const res = await request(server).post("/v1/auth/login").send({
        password: "12345",
      });

      expect(res.status).toBe(400);
    });

    it("Should return 400 if email is not a valid email", async () => {
      const res = await request(server).post("/v1/auth/login").send({
        email: "asaolu",
        password: "12345",
      });

      expect(res.status).toBe(400);
    });

    it("Should return 400 if password is absent", async () => {
      const res = await request(server).post("/v1/auth/login").send({
        email: "asaolu@gmail.com",
      });

      expect(res.status).toBe(400);
    });

    it("Should return 400 if password is less than 2 characters", async () => {
      const res = await request(server).post("/v1/auth/login").send({
        email: "asaolu@gmail.com",
        password: "1",
      });

      expect(res.status).toBe(400);
    });

    it("Should return 400 if email does not exist", async () => {
      const res = await request(server).post("/v1/auth/login").send({
        email: "asaol@gmail.com",
        password: "12345",
      });

      expect(res.status).toBe(400);
    });

    it("Should return 400 if password is incorrect", async () => {
      const res = await request(server).post("/v1/auth/login").send({
        email: "asaolu@gmail.com",
        password: "123456",
      });

      expect(res.status).toBe(400);
    });

    it("Should return 200 if user is succesfully logged in", async () => {
      const res = await request(server).post("/v1/auth/login").send({
        email: "asaolu@gmail.com",
        password: "12345",
      });

      expect(res.status).toBe(200);
    });
  });
});
