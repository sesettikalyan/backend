const express = require("express");
const dotenv = require("dotenv");
const connectToMongoDB = require("./config/connetdb.js");
const Router = require("./routers/route.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path"); // Import path module for serving static files

dotenv.config(); // Load environment variables at the very beginning

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", Router);

connectToMongoDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
