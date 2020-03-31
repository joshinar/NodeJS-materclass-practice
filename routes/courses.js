const express = require("express");
const router = express.Router({ mergeParams: true });
const protect = require("../middleware/auth");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courses");

router
  .route("/")
  .get(getCourses)
  .post(protect, addCourse);
router.route("/:id").get(getCourse);
router.route("/:id").put(protect, updateCourse);
router.route("/:id").delete(protect, deleteCourse);

module.exports = router;
