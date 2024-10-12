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
  pdf.create(pdfTemplate(req.body), {}).toBuffer((err, buffer) => {
    if (err) {
      return res.status(500).send("Error generating PDF");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=ticket.pdf");

    res.status(200).send(buffer);
  });
});

connectToMongoDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
