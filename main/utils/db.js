const mongoose = require("mongoose");
const db = mongoose.connection;
const dbConnection = () => {
  mongoose.connect(process.env.NODE_CLOUD_DB);
  db.on("error", (e) => {
    console.log(`Error occured ${e}`);
  });
  db.once("open", () => {
    console.log("Db is connected succesfully");
  });
};
module.exports = dbConnection;
