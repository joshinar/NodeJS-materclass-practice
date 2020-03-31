const BootCamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder");
const path = require("path");

// @desc : gets all bootcamps
// @route : GET /api/v1/bootcamps
// @access : Public
exports.getBootcamps = async (req, res, next) => {
  let query = BootCamp.find();
  try {
    let queryParams = { ...req.query };
    // sort
    if (queryParams.sort) {
      query = query.sort(queryParams.sort);
    }

    // pagination
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 25;
    const startIdx = (page - 1) * limit;
    const endIdx = page * limit;
    const total = await BootCamp.countDocuments();

    query = query.skip(startIdx).limit(limit);

    const bootcamps = await query;
    // pagination result
    const pagination = {};
    if (endIdx < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIdx > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      total_results: bootcamps.length,
      pagination,
      success: true,
      data: bootcamps
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc : gets single bootcamp
// @route : GET /api/v1/bootcamps/:id
// @access : Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.findById(req.params.id);
    if (!bootcamp) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    // res.status(400).json({ success: false });
    next(error);
  }
};

// @desc : Create new bootcamp
// @route : POST /api/v1/bootcamps
// @access : private
exports.createBootcamp = async (req, res, next) => {
  try {
    
    const bootcamp = await new BootCamp(req.body).save();
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc : Update a bootcamp
// @route : PUT /api/v1/bootcamps/:id
// @access : private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!bootcamp) {
      res.status(400).json({ success: false });
    }
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc : delete a bootcamp
// @route : DELETE /api/v1/bootcamps/:id
// @access : private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      res.status(400).json({ success: false });
    }
    res.status(201).json({ success: true, data: "Bootcamp Deleted" });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
// @desc : Get bootcamps within  radius
// @route : GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access : private
exports.geBootcampsInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params;
  try {
    const loc = await geocoder.geocode(zipcode);
    const lng = loc[0].longitude;
    const lat = loc[0].latitude;
    // earh radius = 6378 km/3963 mi
    const radius = distance / 6378;
    const bootcamps = await BootCamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    res.status(200).json({
      total_results: bootcamps.length,
      success: true,
      data: bootcamps
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc : upload a photo to bootcamp
// @route : PUT /api/v1/bootcamps/:id/photo
// @access : private
exports.bootcampPhotoUpload = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.findById(req.params.id);
    if (!bootcamp) {
      res.status(400).json({ success: false });
    }
    let file = req.files.file;
    if (
      file.mimetype.startsWith("image") &&
      file.size < process.env.FILE_SIZE
    ) {
      file.name = `photo_${bootcamp._id}${path.extname(file.name)}`;
      file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
          console.log(err);
          res.status(500).json({ success: false });
        }
        await BootCamp.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({ success: true, data: file.name });
      });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
