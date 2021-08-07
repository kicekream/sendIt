import users from "./user";
import parcel from "./parcel";
import status from "./status";

module.exports = async (client) => {
    try {
        await client.query(users.CREATE_TABLE);
        await client.query(parcel.CREATE_TABLE);
        await status.query(parcel.CREATE_TABLE);

        console.log(`Table(s) Created`);
    }
    catch(error) {
        console.log({error});
    }
};
