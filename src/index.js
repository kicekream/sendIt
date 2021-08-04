import express from "express";

import {router as parcel} from "./routes/localParcel"

const app = express()
app.use(express.json())

app.use("/v1/localParcel", parcel);

app.listen(3000, ()=>{console.log("App started on port 3000")})