"use strict";

var _pg = require("pg");

require("dotenv/config");

// import models from "./models";
var connect = {
  connectionString: process.env.DATABASE_URL
};
var pool = new _pg.Pool(connect);
pool.on('connect', function () {
  console.log("Database connected successfully");
});
module.exports = pool;
/* 
const poolConnect = async() => {
    const client = await pool.connect();
    try{
        await client.query('BEGIN');
        await models(client);
        await client.query('COMMIT');
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.log(`Error from modelIndex:${error}`);
    }
    finally {
        client.release();
    }
}; */