import express from "express";

import pool from "../database/modelIndex";

import { auth } from "../middleware/auth";
import {admin} from "../middleware/admin"

const router = express.Router();
router.use(express.json());

router.get("/allusers", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users ORDER BY user_id ASC"
    );
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

router.get("/:userId", [auth, admin], async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE user_id=$1", [
      req.params.userId
    ]);
    if (!rows[0])
      return res.status(404).send("User with Specified ID not found");
    res.send(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

router.get("/:userId/parcels", [auth, admin], async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM parcels WHERE parcel_user_id=$1", [
      req.params.userId
    ]);
    if (!rows[0])
      return res.status(404).send("User with Specified ID not found");
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

router.put("/:userId/dakunmakemeadmin", auth, async(req, res)=>{
  const userId = req.params.userId;

  try {
    const { rows } = await pool.query(
      "SELECT user_id FROM users where user_id = $1",
      [userId]
    );

    if (!rows[0])
    return res.status(404).send("User with specified ID not found");

    if (req.user.user_id !== rows[0].user_id) {
      return res.status(403).send("Access denied.");
    }
    
  } catch (err) {
    return res.status(400).send("Error fetching user with specified ID");
  }

  try {
    const {rows} = await pool.query(
      "UPDATE users SET isadmin = $1 WHERE user_id = $2 RETURNING *",
      [true, userId]
    );
    res.send("Congrats, you are now an Admin");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
})

export { router };
