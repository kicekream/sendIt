module.exports = {
  CREATE_TABLE: `DROP TABLE status IF EXISTS status CASCADE;
    CREATE TABLE IF NOT EXISTS status(
        status_id serial PRIMARY KEY,
        status_name VARCHAR(30) NOT NULL
    )
    `,
};
