import fs from "fs";

console.log("see oooo")
const dir = __dirname;
let data = {
    name: "ola",
    age: "miji"
}
data = JSON.stringify(data)
async function rytFyl() {
    try {
    await fs.promises.writeFile(`${dir}/parcelDB.json`, data)
    return `File`;
    }
    catch(error) {
        return `error`
    }
}

console.log(rytFyl())