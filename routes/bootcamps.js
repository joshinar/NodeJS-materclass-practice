const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  geBootcampsInRadius
} = require("../controllers/bootcamps");

router.route("/").get(getBootcamps);
router.route("/:id").get(getBootcamp);
router.route("/").post(createBootcamp);
router.route("/:id").put(updateBootcamp);
router.route("/:id").delete(deleteBootcamp);
router.route("/radius/:zipcode/:distance").get(geBootcampsInRadius);

module.exports = router;
