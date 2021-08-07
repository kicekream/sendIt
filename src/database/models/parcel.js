module.exports = {
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
        cancel_time TIMESTAMPZ,
        FOREIGN KEY (parcel_user_id)
            REFERENCES user (user_id),
        FOREIGN KEY (parcel_status_id)
            REFERENCES status (status_id)
    )    
    `
};
