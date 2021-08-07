"use strict";

module.exports = {
  CREATE_TABLE: "DROP TABLE IF EXISTS parcels CASCADE;\n    CREATE TABLE IF NOT EXISTS parcels(\n        parcel_id serial PRIMARY KEY,\n        parcel_origin VARCHAR(255) NOT NULL,\n        parcel_destination VARCHAR(255) NOT NULL,\n        parcel_note VARCHAR(255),\n        pickup_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,\n        delivery_time TIMESTAMPTZ,\n        cancel_time TIMESTAMPTZ,\n        parcel_user_id INT NOT NULL,\n        parcel_status_id INT NOT NULL,\n        cancel_time TIMESTAMPZ,\n        FOREIGN KEY (parcel_user_id)\n            REFERENCES user (user_id),\n        FOREIGN KEY (parcel_status_id)\n            REFERENCES status (status_id)\n    )    \n    "
};