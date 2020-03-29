const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("colors");

// load env
dotenv.config({ path: "./config/config.env" });

// load models
const Bootcamp = require("./models/Bootcamp");

// connectDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);

// import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data imported".green.inverse);
    process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
