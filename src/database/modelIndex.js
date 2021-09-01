// import { Pool } from "pg";
import {} from "dotenv/config";
import { Sequelize } from "sequelize";

const connectionString =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

// let connect = { connectionString,
//     ssl: { rejectUnauthorized: false } };

const sequelize = new Sequelize(connectionString);

async function sequelizeConnect() {
  try {
    await sequelize.authenticate();
    console.log(`Sequelize connection established`);
  } catch (error) {
    console.error(`Unable to connect to the database ${error}`);
  }
}

sequelizeConnect()

// const pool = new Pool(connect);

module.exports = sequelize;
