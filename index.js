const express = require("express");
const dotenv = require("dotenv");
const connectToMongoDB = require("./config/connetdb.js");
const Router = require("./routers/route.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const flightsRouter = require("./routers/flights.js");
const flightsUserdetailsRouter = require("./routers/flight-userdetails.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", Router);
app.use("/flights", flightsRouter);
app.use("/users", flightsUserdetailsRouter);

connectToMongoDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
