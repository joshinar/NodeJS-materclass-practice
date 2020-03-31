const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// @desc : Get courses
// @route : GET /api/v1/courses
// @route : GET /api/v1/bootcamps/:bootcampId/courses
// @access : Public

exports.getCourses = async (req, res) => {
  let query;
  try {
    if (req.params.bootcampId) {
      query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
      query = Course.find().populate({
        path: "bootcamp",
        select: "name description"
      });
    }
    const courses = await query;
    res
      .status(200)
      .json({ total_results: courses.length, success: true, data: courses });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc : Get a single course
// @route : GET /api/v1/courses/:id
// @access : Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res
      .status(200)
      .json({ total_results: course.length, success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc : Add a course
// @route : POST /api/v1/bootcamps/:bootcampId/courses
// @access : private
exports.addCourse = async (req, res) => {
  try {
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
      res.status(400).json({ success: false });
    } else {
      const course = await new Course(req.body).save();
      res
        .status(200)
        .json({ total_results: course.length, success: true, data: course });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc : Update a course
// @route : PUT /api/v1/courses/:id
// @access : private
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      res.status(400).json({ success: false });
    }
    let updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(201).json({ success: true, data: updatedCourse });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

// @desc : Delete a course
// @route : DELETE /api/v1/courses/:id
// @access : private
exports.deleteCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      res.status(400).json({ success: false });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: "Course Deleted" });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
