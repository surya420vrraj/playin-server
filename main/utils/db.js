const mongoose = require("mongoose");
const db = mongoose.connection;
const dbConnection = () => {
  const url =
    process.env.NODE_MODE === "development"
      ? process.env.NODE_LOCAL_DB
      : process.env.NODE_CLOUD_DB;

  mongoose.connect(url);
  db.on("error", (e) => {
    console.log(`Error occured ${e}`);
  });
  db.once("open", () => {
    console.log("Db is connected succesfully");
  });
};
module.exports = dbConnection;
