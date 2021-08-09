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
      "SELECT parcel_id, parcel_destination, receiver_name, firstname AS sender, status_name FROM parcels JOIN users ON parcel_user_id = user_id JOIN status ON parcel_status_id = status_id"
    );
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:parcelId", auth, async (req, res) => {
  const parcelId = req.params.parcelId;

  try {
    const { rows } = await pool.query(
      "SELECT parcel_id, parcel_destination, receiver_name, firstname AS sender, status_name FROM parcels JOIN users ON parcel_user_id = user_id JOIN status ON parcel_status_id = status_id WHERE parcel_id=$1",
      [parcelId]
    );

    if (req.user.user_id != rows[0].parcel_user_id) {
        return res
          .status(403)
          .send(
            "This action can only be performed by the User that created the order"
          );
      }
      
    if (!rows[0])
      return res.status(404).send("Parcel with specified ID not found");
    res.send(rows);
  } catch (err) {
    console.log(err);
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

  res.json({ data: rows });
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

    if (req.user.isAdmin !== true) {
      return res.status(403).send("Access denied.");
    }
  } catch (err) {
    return res.status(400).send("Error updating parcel info with specified ID");
  }

  try {
    const updateResponse = await pool.query(
      "UPDATE parcels SET parcel_status_id = $1 WHERE parcel_id = $2",
      [req.body.parcelStatus, parcelId]
    );
    res.send("Parcel Status Updated");
  } catch (error) {
    return res.status(400).send("Error updating");
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
  } catch (err) {
    return res.status(400).send("Error updating parcel info with specified ID");
  }

  try {
    const updateResponse = await pool.query(
      "UPDATE parcels SET present_location = $1 WHERE parcel_id = $2",
      [presentLocation, parcelId]
    );
    res.send("Parcel Location Updated");
  } catch (error) {
    return res.status(400).send("Error updating");
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
    return res.status(400).send("Error fetching parcel with specified ID");
  }
  const updateResponse = await pool.query(
    "UPDATE parcels SET parcel_destination = $1 WHERE parcel_id = $2",
    [parcelDestination, parcelId]
  );
  res.send("Destinationn Updated Successfully");
});

router.put("/:parcelId/cancel", auth, async (req, res) => {
  const parcelId = req.params.parcelId;

  try {
    const { rows } = await pool.query(
      "SELECT parcel_id, parcel_user_id, parcel_destination FROM parcels where parcel_id = $1",
      [parcelId]
    );

    if (req.user.user_id !== rows[0].parcel_user_id) {
      return res.status(403).send("Access denied.");
    }
  } catch (err) {
    return res.status(400).send("Error fetching parcel with specified ID");
  }
  const updateResponse = await pool.query(
    "UPDATE parcels SET parcel_status_id = $1 WHERE parcel_id = $2",
    [4, parcelId]
  );
  res.send("Parcel Order Cancelled");
});
export { router };
