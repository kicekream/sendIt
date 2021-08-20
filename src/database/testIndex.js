import { Pool } from "pg";
import {} from "dotenv/config";

// import models from "./models";

let connect = { connectionString: process.env.TEST_DATABASE_URL };

const pool = new Pool(connect);

// pool.on("connect", () => {
//   console.log(`TEST Database connected successfully`);
// });


const poolConnect = async () => {
    const client = await pool.connect();

};
poolConnect();

module.exports = pool;
// module.exports = poolConnect;