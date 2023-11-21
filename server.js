const express = require("express");
const app = express();
const cors = require("cors");
const UserRoutes = require("./main/routes/userRoute");
const ReferalRoute = require("./main/routes/referalRoute");
const BreakRoute = require("./main/routes/breakRoute");
const UserActivityRoute = require("./main/routes/userActivityRoute");
const NotesRoute = require("./main/routes/noteRoute");
const bodyParser = require("body-parser");
const path = require("path");
const errorHandler = require("./main/middlewares/errHandler");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

require("dotenv").config();
require("./main/utils/db")();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", UserRoutes);
app.use("/api/referal", ReferalRoute);
app.use("/api/breaks", BreakRoute);
app.use("/api/user-activity", UserActivityRoute);
app.use("/api/notes", NotesRoute);

//error handler
app.use(errorHandler);

app.listen(8000, () => {
  console.log("server is running succesfully");
});
