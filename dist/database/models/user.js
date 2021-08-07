"use strict";

module.exports = {
  CREATE_TABLE: "CREATE TABLE IF NOT EXISTS users(\n        user_id serial PRIMARY KEY,\n        firstname VARCHAR(150) NOT NULL,\n        lastname VARCHAR(150) NOT NULL,\n        email VARCHAR(255) UNIQUE NOT NULL,\n        password VARCHAR(255) NOT NULL,\n        createdat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,\n        isAdmin BOOLEAN DEFAULT FALSE\n    )\n    "
};