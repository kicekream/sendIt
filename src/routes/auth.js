import express from "express";
import bcrypt from "bcrypt";

import { validateUserReg, validateUserLogin } from "../utils/validateUser";
import { generateAuthToken } from "../utils/jwt";

import User from "../database/models/user";

const router = express.Router();
router.use(express.json());

router.post("/signup", async (req, res) => {
  const { error } = validateUserReg(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { firstname, lastname, email, password } = req.body;
  try {
    const user = await User.findOne({
      attributes: ["email"],
      where: {
        email: email,
      },
    });

    if (user) return res.status(400).send("User already exists");
  } catch (err) {
    console.log(`Error verifying User existence ${err}`);
    res.status(500).send("Something failed, Error verifying user existence");
  }
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
  });

  const userToken = {
    user_id: user.user_id,
    email: user.email,
    isadmin: user.isadmin,
  };

  const token = generateAuthToken(userToken);
  res.header("x-auth-token", token).send(`Registration successful`);
});

router.post("/login", async (req, res) => {
  try {
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;
    const user = await User.findOne({
      attributes: ["user_id", "email", "password", "isadmin"],
      where: {
        email: email,
      },
    });

    if (!user || email !== user.email)
      return res.status(400).send("Invalid email provided");

    const compPassword = await bcrypt.compare(password, user.password);
    if (!compPassword)
      return res.status(400).send("Incorrect password provided");

    const userToken = {
      user_id: user.user_id,
      email: user.email,
      isadmin: user.isadmin,
    };

    const token = generateAuthToken(userToken);

    res.header("x-auth-token", token).send("logged in");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed");
  }
});

export { router };
