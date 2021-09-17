import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../index";

const User = sequelize.define("users", {
  user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firstname: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  createdat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  isadmin: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {timestamps: false});

User.sync()
  .then(() => {
    console.log(`User Table sync okay`);
  })
  .catch((err) => {
    console.log(`error syncing user Table ${err}`);
  });

  module.exports = User;