const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load ENV files
dotenv.config({ path: "./config/config.env" });

// connect DB
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps.js");

const app = express();

// Body parser
app.use(express.json());

// mount routers

app.use("/api/v1/bootcamps", bootcamps);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`.bgYellow.black);
});
