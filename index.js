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

// app.post("/create-pdf", async (req, res) => {
//   const htmlContent = pdfTemplate(req.body);
//   console.log("HTML content:", htmlContent);

//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.setContent(htmlContent);

//     // Generate PDF in memory
//     const buffer = await page.pdf({
//       format: "A4",
//     });

//     await browser.close();

//     // Set response headers
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=result.pdf");

//     // Send the PDF buffer as the response
//     res.send(buffer);
//   } catch (err) {
//     console.error("Error generating PDF:", err);
//     return res.status(500).send("Error generating PDF");
//   }
// });

connectToMongoDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
