const express = require("express");
const protect = require("../middleware/auth");
// include other resource routes for re-routing
const courseRouter = require("./courses");
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  geBootcampsInRadius,
  bootcampPhotoUpload
} = require("../controllers/bootcamps");

// reroute into other routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/").get(getBootcamps);
router.route("/:id").get(getBootcamp);
router.route("/").post(protect, createBootcamp);
router.route("/:id").put(protect, updateBootcamp);
router.route("/:id").delete(protect, deleteBootcamp);
router.route("/:id/photo").put(protect, bootcampPhotoUpload);
router.route("/radius/:zipcode/:distance").get(geBootcampsInRadius);

module.exports = router;
