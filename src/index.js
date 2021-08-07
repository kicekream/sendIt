import express from "express";
import {} from "dotenv/config"
import {Pool} from "pg";

import {router as localParcel} from "./routes/localParcel"

import {router as auth} from "./routes/auth";

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// })

app.use("/v1/localParcel", localParcel);
app.use("/v1/auth", auth)

// pool.on('connect', ()=> {
//     console.log("Postgres Database Connected");
// })
app.listen(port, ()=>{console.log(`App started on port ${port}`)})