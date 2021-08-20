import express from "express";

import pool from "../database/modelIndex";

import {
  validateParcelInfo,
  validateParcelDestination,
  validatePresentLocation,
} from "../utils/validateParcel";

import { auth } from "../middleware/auth";
import { admin } from "../middleware/admin";


const router = express.Router();
router.use(express.json());

router.get("/", auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM parcels "
    );
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

router.get("/:parcelId", auth, async (req, res) => {
  const {parcelId} = req.params;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM parcels WHERE parcel_id=$1",
      [parcelId]
    );
    
    if (!rows[0])
      return res.status(404).send("Parcel with specified ID not found");

    if (req.user.user_id !== rows[0].parcel_user_id) {
      return res
        .status(403)
        .send(
          "This action can only be performed by the User that created the order"
        );
    }

    res.send(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something failed");
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validateParcelInfo(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let {
    receiverName,
    receiverPhone,
    parcelOrigin,
    parcelDestination,
    parcelNote,
  } = req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO parcels (receiver_name, receiver_phone, parcel_origin, parcel_destination, parcel_note, parcel_user_id, parcel_status_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        receiverName,
        receiverPhone,
        parcelOrigin,
        parcelDestination,
        parcelNote,
        req.user.user_id,
        1,
      ]
    );

    res.status(201).json({Message: "Parcel order Successfully Created", data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

router.put("/:parcelId/status", [auth, admin], async (req, res) => {
  const parcelId = parseInt(req.params.parcelId);

  if (typeof parcelId == NaN || req.body.parcelStatus > 4)
    return res.status(400).send("Status ID must be a number between 1 and 4");

  try {
    const { rows } = await pool.query(
      "SELECT parcel_id, parcel_user_id, parcel_destination FROM parcels where parcel_id = $1",
      [parcelId]
    );

    // if (req.user.isAdmin !== true) {
    //   return res.status(403).send("Access denied.");
    // }
    if (!rows[0])
      return res.status(404).send("Parcel with specified ID not found");
  } catch (err) {
    return res.status(400).send("Error updating parcel info with specified ID");
  }

  try {
    const {rows} = await pool.query(
      "UPDATE parcels SET parcel_status_id = $1 WHERE parcel_id = $2 RETURNING *",
      [req.body.parcelStatus, parcelId]
    );
    res.send(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error Updating, Something failed");
  }
});

router.put("/:parcelId/presentlocation", [auth, admin], async (req, res) => {
  const { error } = validatePresentLocation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { parcelId } = req.params;
  const { presentLocation } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT parcel_id, parcel_user_id, parcel_destination FROM parcels where parcel_id = $1",
      [parcelId]
    );
    if (!rows[0])
    return res.status(404).send("Parcel with specified ID not found");
  } catch (err) {
    return res.status(400).send("Error updating parcel info with specified ID");
  }

  try {
    const {rows} = await pool.query(
      "UPDATE parcels SET present_location = $1 WHERE parcel_id = $2 RETURNING *",
      [presentLocation, parcelId]
    );
    res.send(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error Updating, Something failed");
  }
});

router.put("/:parcelId/destination", auth, async (req, res) => {
  const { error } = validateParcelDestination(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const parcelId = req.params.parcelId;
  const { parcelDestination } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT parcel_id, parcel_user_id, parcel_destination FROM parcels where parcel_id = $1",
      [parcelId]
    );
    if (req.user.user_id != rows[0].parcel_user_id) {
      return res
        .status(403)
        .send(
          "This action can only be performed by the User that created the order"
        );
    }
  } catch (err) {
    return res.status(404).send("Error fetching parcel with specified ID");
  }
  const {rows} = await pool.query(
    "UPDATE parcels SET parcel_destination = $1 WHERE parcel_id = $2 RETURNING *",
    [parcelDestination, parcelId]
  );
  res.send(rows[0]);
});

router.put("/:parcelId/cancel", auth, async (req, res) => {
  const parcelId = req.params.parcelId;

  try {
    const { rows } = await pool.query(
      "SELECT parcel_id, parcel_user_id, parcel_destination FROM parcels where parcel_id = $1",
      [parcelId]
    );

    if (!rows[0])
    return res.status(404).send("Parcel with specified ID not found");

    if (req.user.user_id !== rows[0].parcel_user_id) {
      return res.status(403).send("Access denied.");
    }
    
  } catch (err) {
    return res.status(400).send("Error fetching parcel with specified ID");
  }

  try {
    const {rows} = await pool.query(
      "UPDATE parcels SET parcel_status_id = $1 WHERE parcel_id = $2 RETURNING *",
      [4, parcelId]
    );
    res.send(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});
export { router };
