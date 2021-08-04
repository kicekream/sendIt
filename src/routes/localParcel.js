import express from "express";
import fs from "fs";
import { parse } from "path";

const router = express.Router();
router.use(express.json());

const dir = __dirname;
let rawData = fs.readFileSync(`${dir}/parcelDB.json`, "utf-8");

const parcels = JSON.parse(rawData);

router.get("/", (req, res) => {
  res.send("This is homepage");
});

router.get("/parcels", (req, res) => {
  if (parcels.length <= 0) {
    return res.status(404).send("No parcel information available");
  }
  res.json(parcels);
});

router.get("/parcels/:parcelId", (req, res) => {
  const parcelId = parseInt(req.params.parcelId);

  const singleParcelData = parcels.find((p) => p.id === parcelId);
  if (!singleParcelData)
    return res.status(404).send("Parcel with specified ID not found");

  res.json(singleParcelData);
});

router.get("/users/:userid/parcels", (req, res) => {
  const username = req.params.userid.toLowerCase();
  const userParcels = parcels.filter((p) => p.parcelOwner === username);
  if (!userParcels)
    return res.status(404).send("Parcel(s) with specified user not found");

  res.json(userParcels);
});

router.put("/parcels/:parcelId/cancel", async(req, res) => {
  const parcelId = parseInt(req.params.parcelId);
  const singleParcelData = parcels.find((p) => p.id === parcelId);
  if (!singleParcelData)
    return res.status(404).send("Parcel with specified ID not found");

  singleParcelData.status = "Cancelled";
  parcels.splice(parcelId - 1, 1, singleParcelData);
  try {
    await fs.promises.writeFile(
      `${dir}/parcelDB.json`,
      JSON.stringify(parcels, null, 2),
      "utf-8"
    );
    res.send(`Parcel order Cancelled`);
  } catch (error) {
    console.log(error);
  }
});

router.post("/parcels", async (req, res) => {
  const lastParcel = parcels[parcels.length - 1].id;
  let parcel = {
    id: lastParcel + 1,
    parcelOwner: req.body.parcelOwner,
    status: "Created",
    createdAt: Date(),
  };

  parcels.push(parcel);
  try {
    await fs.promises.writeFile(
      `${dir}/parcelDB.json`,
      JSON.stringify(parcels, null, 2),
      "utf-8"
    );
    res.send(`Parcel order successfully created`);
  } catch (error) {
    console.log(error);
  }
});

export { router };
