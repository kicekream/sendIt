import express from "express";
import {} from "sequelize";

import pool from "../database/modelIndex";

import User from "../database/models/user";
import Parcel from "../database/models/parcel";

import { auth } from "../middleware/auth";
import { admin } from "../middleware/admin";

const router = express.Router();
router.use(express.json());

router.get("/allusers", async (req, res) => {
  try {
    /* const { rows } = await pool.query(
      "SELECT * FROM users ORDER BY user_id ASC"
    ); */
    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

router.get("/:userId", [auth, admin], async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).send("User with Specified ID not found");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

router.get("/:userId/parcels", [auth, admin], async (req, res) => {
  try {
    const parcelData = await Parcel.findAll({
      where: {
        parcel_user_id: req.params.userId,
      },
    });
    if (!parcelData)
      return res.status(404).send("User with Specified ID not found");

    if (parcelData.length < 1)
      return res
        .status(404)
        .send("User not found or No parcel history yet for this user");
    res.send(parcelData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

router.put("/:userId/dakunmakemeadmin", auth, async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).send("User with specified ID not found");

    if (req.user.user_id !== user.user_id) {
      return res.status(403).send("Access denied.");
    }
  } catch (err) {
    return res.status(400).send("Error fetching user with specified ID");
  }

  try {
    const user = await User.update(
      { isadmin: true },
      {
        where: {
          user_id: userId,
        },
      }
    );
    res.send("Congrats, you are now an Admin");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

export { router };
