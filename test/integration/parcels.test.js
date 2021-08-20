import request from "supertest";
const { Pool } = require("pg");
import pool from "../../src/database/modelIndex";
import {} from "dotenv/config";

import { generateAuthToken } from "../../src/utils/jwt";

import server from "../../src/index";

const userForToken = {
  user_id: 1,
  email: "adeola@email.com",
  isadmin: true,
};

describe("/v1/parcels", () => {
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

  describe("GET /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server).get("/v1/parcels");
      expect(res.status).toBe(401);
    });

    it("should return all parcels", async () => {
      const res = await request(server)
        .get("/v1/parcels")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((d) => d.parcel_id === 1)).toBeTruthy();
      expect(res.body.some((d) => d.parcel_id === 2)).toBeTruthy();
    });
  });

  describe("GET /:parcelId", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server).get("/v1/parcels/1");
      expect(res.status).toBe(401);
    });

    it("should return 404 if parcel not found", async () => {
      const parcelId = 100;
      const res = await request(server)
        .get(`/v1/parcels/${parcelId}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("Should return 403 if owner isn't the one requesting for the parcel info", async () => {
      userForToken.user_id = 100;
      const forbiddenToken = generateAuthToken(userForToken);
      const res = await request(server)
        .get(`/v1/parcels/1`)
        .set("x-auth-token", forbiddenToken);
      expect(res.status).toBe(403);
    });

    it("should return specified parcel", async () => {
      const res = await request(server)
        .get("/v1/parcels/1")
        .set("x-auth-token", token);
      expect(res.body.length).toBe(1);
      expect(res.status).toBe(200);
    });
  });

  describe("POST /", () => {
    it("Should return 401 if client is not logged in", async () => {
      const res = await request(server).post("/v1/parcels").send({
        receiverName: "Akala",
        receiverPhone: "1234567890",
        parcelOrigin: "Ibadan",
        parcelDestination: "Oyo",
        parcelNote: "afar",
      });
      expect(res.status).toBe(401);
    });

    it("Should return 400 if receiverName field is missing or length is less than 2", async () => {
      const res = await request(server)
        .post("/v1/parcels")
        .set("x-auth-token", token)
        .send({
          receiverName: "",
          receiverPhone: "1234567890",
          parcelOrigin: "Ibadan",
          parcelDestination: "Oyo",
          parcelNote: "afar",
        });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if receiverPhone field is missing or length is less than 2", async () => {
      const res = await request(server)
        .post("/v1/parcels")
        .set("x-auth-token", token)
        .send({
          receiverName: "Akala",
          receiverPhone: "1",
          parcelOrigin: "Ibadan",
          parcelDestination: "Oyo",
          parcelNote: "afar",
        });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if parcelOrigin field is missing or length is less than 2", async () => {
      const res = await request(server)
        .post("/v1/parcels")
        .set("x-auth-token", token)
        .send({
          receiverName: "Akala",
          receiverPhone: "1234567890",
          parcelOrigin: "I",
          parcelDestination: "Oyo",
          parcelNote: "afar",
        });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if parcelDestination field is missing or length is less than 2", async () => {
      const res = await request(server)
        .post("/v1/parcels")
        .set("x-auth-token", token)
        .send({
          receiverName: "Akala",
          receiverPhone: "1234567890",
          parcelOrigin: "I",
          parcelDestination: "O",
          parcelNote: "afar",
        });
      expect(res.status).toBe(400);
    });

    it("Should return 400 if parcelNote field is empty missing and it is in request.body", async () => {
      const res = await request(server)
        .post("/v1/parcels")
        .set("x-auth-token", token)
        .send({
          receiverName: "Akala",
          receiverPhone: "1234567890",
          parcelOrigin: "Ibadan",
          parcelDestination: "Oyo",
          parcelNote: "",
        });
      expect(res.status).toBe(400);
    });

    it("Should return 201 if parcelNote field is not in request.body", async () => {
      const res = await request(server)
        .post("/v1/parcels")
        .set("x-auth-token", token)
        .send({
          receiverName: "Akala",
          receiverPhone: "1234567890",
          parcelOrigin: "Ibadan",
          parcelDestination: "Oyo",
        });
      expect(res.status).toBe(201);
    });

    it("should return 201 with array of parcels", async () => {
      const res = await request(server)
        .post("/v1/parcels")
        .set("x-auth-token", token)
        .send({
          receiverName: "Akala",
          receiverPhone: "1234567890",
          parcelOrigin: "Ibadan",
          parcelDestination: "Oyo",
          parcelNote: "afar",
        });
      //   console.log(res.body)
      expect(res.status).toBe(201);
      expect(res.body.data[0]).toHaveProperty("parcel_id", 3);
      expect(res.body.data[0]).toHaveProperty("receiver_name", "Akala");
      expect(res.body.data[0]).not.toBeNull();
    });
  });

  describe("PUT /:parcelId/status", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .put("/v1/parcels/1/status")
        .send({ parcelStatus: 3 });
      expect(res.status).toBe(401);
    });

    it("should return 400 if statusID is not a number between 1 and 4", async () => {
      const res = await request(server)
        .put("/v1/parcels/1/status")
        .send({ parcelStatus: 100 })
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("Should return 403 if user is not an admin", async () => {
      userForToken.isadmin = false;
      const forbiddenToken = generateAuthToken(userForToken);
      const res = await request(server)
        .put(`/v1/parcels/1/status`)
        .send({ parcelStatus: 1 })
        .set("x-auth-token", forbiddenToken);
      expect(res.status).toBe(403);
    });

    it("Should return 404 if parcelId is not found", async () => {
      const parcelId = 100;
      const res = await request(server)
        .put(`/v1/parcels/${parcelId}/status`)
        .send({ parcelStatus: 1 })
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("Should return 200 if status change is successful", async () => {
      const parcelId = 1;
      const res = await request(server)
        .put(`/v1/parcels/${parcelId}/status`)
        .send({ parcelStatus: 3 })
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body.parcel_status_id).toBe(3);
      expect(res.body).toMatchObject({
        parcel_id: parcelId,
        parcel_status_id: 3,
      });
    });
  });

  describe("PUT /:parcelId/destination", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .put("/v1/parcels/1/destination")
        .send({ parcelDestination: "askamaya" });
      expect(res.status).toBe(401);
    });

    it("should return 400 if parcelDestination field is missing", async () => {
      const res = await request(server)
        .put("/v1/parcels/1/destination")
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("should return 400 if parcelDestination field is less than 2 characters", async () => {
      const res = await request(server)
        .put("/v1/parcels/1/destination")
        .send({ parcelDestination: "1" })
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("should return 400 if parcelDestination field is greater than 255 characters", async () => {
      const parcelDestination = new Array(257).join("a");
      const res = await request(server)
        .put("/v1/parcels/1/destination")
        .send({ parcelDestination })
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("should return 403 if User is different from parcelOwner", async () => {
      userForToken.user_id = 100;
      const forbiddenToken = generateAuthToken(userForToken);
      const res = await request(server)
        .put("/v1/parcels/1/destination")
        .send({ parcelDestination: "adeola" })
        .set("x-auth-token", forbiddenToken);

      expect(res.status).toBe(403);
    });

    it("Should return 404 if parcel is not found", async () => {
      const res = await request(server)
        .put("/v1/parcels/100/destination")
        .send({ parcelDestination: "adeola" })
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });

    it("should return 200 if parcelDestination is successfully changed", async () => {
      const parcel_destination = "adeola";
      const parcel_id = 1;
      const res = await request(server)
        .put(`/v1/parcels/${parcel_id}/destination`)
        .send({ parcelDestination: parcel_destination })
        .set("x-auth-token", token);
      // console.log(res.body)
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ parcel_id, parcel_destination });
    });
  });

  describe("PUT /:parcelId/presentlocation", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .put("/v1/parcels/1/presentLocation")
        .send({ presentLocation: "askamaya" });
      expect(res.status).toBe(401);
    });

    it("should return 400 if presentLocation field is missing", async () => {
      const res = await request(server)
        .put("/v1/parcels/1/presentlocation")
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("should return 400 if presentLocation field is less than 2 characters", async () => {
      const res = await request(server)
        .put("/v1/parcels/1/presentlocation")
        .send({ presentLocation: "1" })
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("should return 400 if presentLocation field is greater than 255 characters", async () => {
      const presentLocation = new Array(257).join("a");
      const res = await request(server)
        .put("/v1/parcels/1/presentlocation")
        .send({ presentLocation })
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("should return 403 if User is not an admin", async () => {
      userForToken.isadmin = false;
      const forbiddenToken = generateAuthToken(userForToken);
      const res = await request(server)
        .put("/v1/parcels/1/presentlocation")
        .send({ presentLocation: "adeola" })
        .set("x-auth-token", forbiddenToken);

      expect(res.status).toBe(403);
    });

    it("Should return 404 if parcel is not found", async () => {
      const res = await request(server)
        .put("/v1/parcels/100/presentlocation")
        .send({ presentLocation: "adeola" })
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });

    it("Should return 200 if status change is successful", async () => {
      const parcelId = 1;
      const res = await request(server)
        .put(`/v1/parcels/${parcelId}/presentlocation`)
        .send({ presentLocation: "Abroad" })
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        parcel_id: parcelId,
        present_location: "Abroad",
      });
    });
  });

  describe("PUT /:parcelId/cancel", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server).put("/v1/parcels/1/cancel");
      expect(res.status).toBe(401);
    });

    it("should return 403 if User is different from parcelOwner", async () => {
      userForToken.user_id = 100;
      const forbiddenToken = generateAuthToken(userForToken);
      const res = await request(server)
        .put("/v1/parcels/1/cancel")
        .set("x-auth-token", forbiddenToken);

      expect(res.status).toBe(403);
    });

    it("Should return 404 if parcel is not found", async () => {
      const res = await request(server)
        .put("/v1/parcels/100/cancel")
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });

    it("should return 200 if parcel order is successfully cancelled", async () => {
      const parcel_status = 4;
      const parcel_id = 1;
      const res = await request(server)
        .put(`/v1/parcels/${parcel_id}/cancel`)
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        parcel_id,
        parcel_status_id: parcel_status,
      });
    });
  });
});
