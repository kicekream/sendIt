import request from "supertest";
const { Pool } = require("pg");
import pool from "../../src/database/modelIndex";
import {} from "dotenv/config";

import { generateAuthToken } from "../../src/utils/jwt";

import server from "../../src/index";

const userForToken = {
  user_id: 1,
  email: "asaolu@gmail.com",
  isadmin: true,
};

describe("/v1/users", () => {
  beforeEach(async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS parcels(
            parcel_id serial PRIMARY KEY,
            receiver_name VARCHAR(100) NOT NULL,
            receiver_phone VARCHAR(50) NOT NULL,
            parcel_origin VARCHAR(255) NOT NULL,
            present_location VARCHAR(255),
            parcel_destination VARCHAR(255) NOT NULL,
            parcel_note VARCHAR(255),
            pickup_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            delivery_time TIMESTAMPTZ DEFAULT NULL,
            cancel_time TIMESTAMPTZ DEFAULT NULL,
            parcel_user_id INT NOT NULL,
            parcel_status_id INT NOT NULL,
            FOREIGN KEY (parcel_user_id)
                REFERENCES users (user_id),
            FOREIGN KEY (parcel_status_id)
                REFERENCES status (status_id)
        )`);
    await pool.query(`INSERT INTO 
        parcels(receiver_name, receiver_phone, parcel_origin, parcel_destination, parcel_note, parcel_user_id, parcel_status_id) 
        VALUES
        ('Ajani', '08012345678', 'Ikeja, Lagos',  'Lekki, Lagos', 'Hello dear', 1, 1),
        ('Ajala', '08012345678', 'Ikeja, Lagos',  'Lekki, Lagos', 'Hello dear', 1, 1)
         `);
  });

  afterEach(async () => {
    await pool.query("DELETE FROM parcels");
    await pool.query("DROP TABLE parcels");
  });

  afterAll(async () => {
    server.close();
    pool.end();
  });

  const token = generateAuthToken(userForToken);

  describe("GET /allusers", () => {
    it("Should return 200 and current number of users", async () => {
      const res = await request(server).get("/v1/users/allusers");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe("GET /:userId", () => {
    it("Should return 401 if user is not logged in", async () => {
      const res = await request(server).get("/v1/users/1");
      expect(res.status).toBe(401);
    });

    it("Should return 403 if user is not an admin", async () => {
      userForToken.isadmin = false;
      const forbiddenToken = generateAuthToken(userForToken);
      const res = await request(server)
        .get("/v1/users/1")
        .set("x-auth-token", forbiddenToken);
      expect(res.status).toBe(403);
    });

    it("Should return 404 if user is not found", async () => {
      const res = await request(server)
        .get("/v1/users/100")
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("Should return 200 and the user", async () => {
      const res = await request(server)
        .get("/v1/users/1")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body.user_id).toBe(1);
    });
  });

  describe("GET /:userId/parcels", () => {
    it("Should return 401 if user is not logged in", async () => {
      const res = await request(server).get("/v1/users/1/parcels");
      expect(res.status).toBe(401);
    });

    it("Should return 403 if user is not an admin", async () => {
      userForToken.isadmin = false;
      const forbiddenToken = generateAuthToken(userForToken);
      const res = await request(server)
        .get("/v1/users/1/parcels")
        .set("x-auth-token", forbiddenToken);
      expect(res.status).toBe(403);
    });

    it("Should return 404 if user is not found", async () => {
      const res = await request(server)
        .get("/v1/users/100/parcels")
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("Should return 200 and the user", async () => {
      const res = await request(server)
        .get("/v1/users/1/parcels")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body[0].parcel_user_id).toBe(1);
    });
  });

  describe("PUT /:userId/dakunmakemeadmin", () => {
    it("Should return 401 if user is not logged in", async () => {
      const res = await request(server).put("/v1/users/1/dakunmakemeadmin");
      expect(res.status).toBe(401);
    });

    it("Should return 403 if UserId is not the same as logged in User", async () => {
        userForToken.user_id = 100;
      const forbiddenToken = generateAuthToken(userForToken);
      const res = await request(server).put("/v1/users/1/dakunmakemeadmin")
      .set("x-auth-token", forbiddenToken);
      expect(res.status).toBe(403);
    });

    it("Should return 404 if user is not found", async () => {
      const res = await request(server)
        .put("/v1/users/100/dakunmakemeadmin")
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("Should return 200 and the user", async () => {
      const res = await request(server)
        .put("/v1/users/1/dakunmakemeadmin")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
    });
  });
});
