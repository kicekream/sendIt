import express from "express";

import Parcel from "../database/models/parcel";
import Status from "../database/models/status";

import {
  validateParcelInfo,
  validateParcelDestination,
  validatePresentLocation,
} from "../utils/validateParcel";

import { auth } from "../middleware/auth";
import { admin } from "../middleware/admin";

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const parcels = await Parcel.findAll();
    res.send(parcels);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

router.get("/:parcelId", auth, async (req, res) => {
  const { parcelId } = req.params;

  try {
    const parcelData = await Parcel.findByPk(parcelId);

    if (!parcelData)
      return res.status(404).send("Parcel with specified ID not found");

    if (req.user.user_id !== parcelData.parcel_user_id) {
      return res
        .status(403)
        .send(
          "This action can only be performed by the User that created the order"
        );
    }

    res.send(parcelData);
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

  const parcelData = {
    receiver_name: receiverName,
    receiver_phone: receiverPhone,
    parcel_origin: parcelOrigin,
    parcel_destination: parcelDestination,
    parcel_note: parcelNote,
    parcel_user_id: req.user.user_id,
    parcel_status_id: 1,
  };
  try {
    const newParcel = await Parcel.create(parcelData);

    res
      .status(201)
      .json({ Message: "Parcel order Successfully Created", data: newParcel });
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
    const parcelData = await Parcel.findOne({
      attributes: ["parcel_id", "parcel_user_id", "parcel_destination"],
      where: {
        parcel_id: parcelId,
      },
    });

    if (!parcelData)
      return res.status(404).send("Parcel with specified ID not found");
  } catch (err) {
    return res.status(400).send(`Error updating parcel info with specified ID`);
  }

  try {
    const parcelData = await Parcel.update(
      { parcel_status_id: req.body.parcelStatus },
      {
        where: {
          parcel_id: parcelId,
        },
      }
    );
    res.send(`Status updated successfully`);
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
    const parcelData = await Parcel.findOne({
      attributes: ["parcel_id", "parcel_user_id", "present_location"],
      where: {
        parcel_id: parcelId,
      },
    });

    if (!parcelData)
      return res.status(404).send("Parcel with specified ID not found");
  } catch (err) {
    return res.status(400).send(`Error updating parcel info with specified ID`);
  }

  try {
    const parcelData = await Parcel.update(
      { present_location: presentLocation },
      {
        where: {
          parcel_id: parcelId,
        },
      }
    );
    res.send(`Parcel Location updated`);
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
    const parcelData = await Parcel.findOne({
      attributes: ["parcel_id", "parcel_user_id", "parcel_destination"],
      where: {
        parcel_id: parcelId,
      },
    });
    if (req.user.user_id != parcelData.parcel_user_id) {
      return res
        .status(403)
        .send(
          "This action can only be performed by the User that created the order"
        );
    }
  } catch (err) {
    return res
      .status(404)
      .send(`Error fetching parcel with specified ID ${err}`);
  }
  const parcelData = await Parcel.update(
    { parcel_destination: parcelDestination },
    {
      where: {
        parcel_id: parcelId,
      },
    }
  );
  res.send(`Parcel Destination Updated`);
});

router.put("/:parcelId/cancel", auth, async (req, res) => {
  const parcelId = req.params.parcelId;

  try {
    const parcelData = await Parcel.findOne({
      attributes: ["parcel_id", "parcel_user_id", "parcel_status_id"],
      where: {
        parcel_id: parcelId,
      },
    });

    if (!parcelData)
      return res.status(404).send("Parcel with specified ID not found");

    if (req.user.user_id !== parcelData.parcel_user_id) {
      return res.status(403).send("Access denied.");
    }
  } catch (err) {
    return res.status(400).send("Error fetching parcel with specified ID");
  }

  try {
    const parcelData = await Parcel.update(
      { parcel_status_id: 4 },
      {
        where: {
          parcel_id: parcelId,
        },
      }
    );
    res.send(parcelData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});
export { router };
