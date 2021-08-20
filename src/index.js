import express from "express";
import {} from "dotenv/config";

import { router as localParcel } from "./routes/localParcel";

import { router as auth } from "./routes/auth";
import {router as parcels} from "./routes/parcels";
import {router as users} from "./routes/users"

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/v1/localParcel", localParcel);
app.use("/v1/auth", auth);
app.use("/v1/parcels", parcels);
app.use("/v1/users", users)

if (!process.env.jwtPrivateKey) {
  console.error("jwtPrivateKey is not defined in env variable");
  process.exit(1);
}

const server = app.listen(port, () => {
  console.log(`App started on port ${port}, database started as ${process.env.NODE_ENV}`);
});

module.exports = server;