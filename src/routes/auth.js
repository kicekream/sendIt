import express from "express";

import pool from "../database/modelIndex";

import {validateUserReg, validateUserLogin} from "../utils/validateUser"

const router = express.Router();
router.use(express.json());

router.get("/", async(req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users ORDER BY user_id ASC"
    );
    res.send(rows[0]);
  } catch (error) {
    console.log(error);
  }
});

router.post("")



export { router };
