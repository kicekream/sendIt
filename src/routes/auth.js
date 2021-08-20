import express from "express";
import bcrypt from "bcrypt";

import pool from "../database/modelIndex";

import { validateUserReg, validateUserLogin } from "../utils/validateUser";
import { generateAuthToken } from "../utils/jwt";

import { auth } from "../middleware/auth";

const router = express.Router();
router.use(express.json());

router.post("/signup", async (req, res) => {
  const { error } = validateUserReg(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { firstname, lastname, email, password } = req.body;
  try {
    const { rows } = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email]
    );
    if (rows.length >= 1) return res.status(400).send("User already exists");
  } catch (err) {
    console.log(`Error verifying User existence`);
    res.status(500).send("Something failed, Error verifying user existence");
  }
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const { rows } = await pool.query(
    "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING user_id, email, isAdmin",
    [firstname, lastname, email, password]
  );
  const token = generateAuthToken(rows[0]);
  res.header("x-auth-token", token).send(rows[0]);
});

router.post("/login", async (req, res) => {
  try {
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;
    const { rows } = await pool.query(
      "SELECT user_id, email, password, isAdmin FROM users WHERE email = $1",
      [email]
    );

    if (rows.length === 0 || email !== rows[0].email)
      return res.status(400).send("Invalid email provideds");

    const compPassword = await bcrypt.compare(password, rows[0].password);
    if (!compPassword)
      return res.status(400).send("Incorrect password provided");

    const token = generateAuthToken(rows[0]);

    res.header("x-auth-token", token).send("logged in");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

export { router };
