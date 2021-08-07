module.exports = {
  CREATE_TABLE: `CREATE TABLE IF NOT EXISTS users(
        user_id serial PRIMARY KEY,
        firstname VARCHAR(150) NOT NULL,
        lastname VARCHAR(150) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        isAdmin BOOLEAN DEFAULT FALSE
    )
    `
};
