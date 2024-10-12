const express = require("express");
const dotenv = require("dotenv");
const connectToMongoDB = require("./config/connetdb.js");
const Router = require("./routers/route.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const flightsRouter = require("./routers/flights.js");
const flightsUserdetailsRouter = require("./routers/flight-userdetails.js");
const bookingsRouter = require("./routers/bookings.js");

const pdf = require("html-pdf");

const pdfTemplate = require("./documents");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", Router);
app.use("/flights", flightsRouter);
app.use("/users", flightsUserdetailsRouter);
app.use("/bookings", bookingsRouter);

app.post("/create-pdf", (req, res) => {
  pdf.create(pdfTemplate(req.body), {}).toFile("result.pdf", (err) => {
    if (err) {
      res.send(Promise.reject());
    }

    res.send(Promise.resolve());
  });
});

app.get("/fetch-pdf", (req, res) => {
  res.sendFile(`${__dirname}/result.pdf`);
});

connectToMongoDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
