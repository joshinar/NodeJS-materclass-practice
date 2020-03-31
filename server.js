const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

// Load ENV files
dotenv.config({ path: "./config/config.env" });

// connect DB
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps.js");
const courses = require("./routes/courses.js");
const auth = require("./routes/auth.js");

const app = express();

// Body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// file uploading
app.use(fileUpload());
// app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("./public"));

// mount routers

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`.bgYellow.black);
});
