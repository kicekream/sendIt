"use strict";

module.exports = {
  CREATE_TABLE: "DROP TABLE status IF EXISTS status CASCADE;\n    CREATE TABLE IF NOT EXISTS status(\n        status_id serial PRIMARY KEY,\n        status_name VARCHAR(30) NOT NULL\n    )\n    "
};