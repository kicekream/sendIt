import { Pool } from "pg";
import {} from "dotenv/config";

// import models from "./models";

const string =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

let connect = { connectionString: string, 
    ssl: { rejectUnauthorized: false } };

const pool = new Pool(connect);

module.exports = pool;
