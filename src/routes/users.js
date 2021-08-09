import express from "express";

import pool from "../database/modelIndex";

import { auth } from "../middleware/auth";
import {admin} from "../middleware/admin"

const router = express.Router();
router.use(express.json());

router.get("/:userId", [auth, admin], async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE user_id=$1", [
      req.params.userId
    ]);
    if (!rows[0])
      return res.status(404).send("User with Specified ID not found");
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

export { router };
