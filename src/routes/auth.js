import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import pool from "../database/modelIndex";

import { validateUserReg, validateUserLogin } from "../utils/validateUser";
import {generateAuthToken} from "../utils/jwt"

import {auth} from "../middleware/auth"

const router = express.Router();
router.use(express.json());

router.get("/allusers", auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users ORDER BY user_id ASC"
    );
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

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
  }
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const { rows } = await pool.query(
    "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING user_id, email, isAdmin",
    [firstname, lastname, email, password]
  );
  const token = generateAuthToken(rows[0])
  res.header("x-auth-token", token).send("Registration successful")
});

router.post("/login", async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;
  const { rows } = await pool.query(
    "SELECT user_id, email, password, isAdmin FROM USERS WHERE email = $1",
    [email]
  );

  if (rows.length === 0 || email !== rows[0].email)
    return res.status(400).send("Invalid email provided");

  const compPassword = await bcrypt.compare(password, rows[0].password);
  if (!compPassword) return res.status(400).send("Incorrect password provided");


  const token = generateAuthToken(rows[0])

  res.header("x-auth-token", token).send("logged in")
});

export { router };
