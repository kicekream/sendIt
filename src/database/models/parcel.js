import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../modelIndex";

// import User from "./user";
// import Status from "./status";

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

/* module.exports = {
  CREATE_TABLE: `DROP TABLE IF EXISTS parcels CASCADE;
    CREATE TABLE IF NOT EXISTS parcels(
        parcel_id serial PRIMARY KEY,
        parcel_origin VARCHAR(255) NOT NULL,
        parcel_destination VARCHAR(255) NOT NULL,
        parcel_note VARCHAR(255),
        pickup_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        delivery_time TIMESTAMPTZ,
        cancel_time TIMESTAMPTZ,
        parcel_user_id INT NOT NULL,
        parcel_status_id INT NOT NULL,
        FOREIGN KEY (parcel_user_id)
            REFERENCES user (user_id),
        FOREIGN KEY (parcel_status_id)
            REFERENCES status (status_id)
    )    
    `,
}; */
