import {Pool} from "pg";
import {} from "dotenv/config"

// import models from "./models";

let connect = {connectionString: process.env.DATABASE_URL}

const pool  = new Pool(connect)

pool.on('connect', ()=> {
    console.log(`Database connected successfully`)
});
module.exports = pool;


const poolConnect = async() => {
    const client = await pool.connect();
    try{
        await client.query('BEGIN');
        await client.query('COMMIT');
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.log(`Error from modelIndex:${error}`);
    }
    finally {
        client.release();
    }
};
poolConnect()
