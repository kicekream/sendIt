import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../modelIndex";

const Status = sequelize.define("status", {
  status_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  status_name: { type: DataTypes.STRING(30), allowNull: false },
}, {freezeTableName: true, timestamps: false});

async function createStatuses() {
  try {
    await Status.bulkCreate(
      { status_name: "pending" },
      { status_name: "in-progress" },
      { status_name: "delivered" },
      { status_name: "cancelled" }
    );
    console.log(`Status data inserted`)
  } catch (err) {
    console.log(`Error inserting status data ${err}`);
  }
};

createStatuses();

Status.sync()
  .then(() => {
    console.log(`Status Table sync okay`);
  })
  .catch((err) => {
    console.log(`error syncing Status Table ${err}`);
  });

module.exports = Status


/* module.exports = {
  CREATE_TABLE: `DROP TABLE status IF EXISTS status CASCADE;
    CREATE TABLE IF NOT EXISTS status(
        status_id serial PRIMARY KEY,
        status_name VARCHAR(30) NOT NULL
    )
    `,
};
 */
