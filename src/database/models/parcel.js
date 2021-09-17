import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../index";

const Parcel = sequelize.define(
  "parcels",
  {
    parcel_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    receiver_name: { type: DataTypes.STRING(100), allowNull: false },
    receiver_phone: { type: DataTypes.STRING(50), allowNull: false },
    parcel_origin: { type: DataTypes.STRING(255), allowNull: false },
    present_location: { type: DataTypes.STRING(255) },
    parcel_destination: { type: DataTypes.STRING(255), allowNull: false },
    parcel_note: { type: DataTypes.STRING(255) },
    pickup_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    delivery_time: { type: DataTypes.DATE },
    cancel_time: { type: DataTypes.DATE },
    parcel_user_id: {
      type: DataTypes.INTEGER,
      references: { model: "User", key: "user_id" },
      allowNull: false,
    },
    parcel_status_id: {
      type: DataTypes.INTEGER,
      references: { model: "Status", key: "status_id" },
      allowNull: false,
    },
  },
  { timestamps: false }
);

Parcel.sync()
  .then(() => {
    console.log(`Parcel Table sync okay`);
  })
  .catch((err) => {
    console.log(`error syncing Parcel Table ${err}`);
  });

module.exports = Parcel;