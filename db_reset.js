"use_strict";
let dbmodule = require("./db_connect.js");
let dbconnect = new dbmodule("10.2.147.123");

async function main(){
    await dbconnect.cleanData();
}
main();