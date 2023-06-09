const Course = require("../modles/Course")
const Bootcamp = require("../modles/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const { listenerCount } = require("../modles/Course")

// @desc Get All courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({
            bootcamp: req.params.bootcampId
        })

        return  res.status(200).json({
            success: true,
            data: courses,
            count: courses.length,
        })
    } else {
        res.status(200).json(res.advancedResults)
    }

    const courses = await query

    res.status(200).json({
        success: true,
        data: courses,
        count: courses.length,
    })
})

// @desc Get single course
// @route GET /api/v1/course/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description",
    })

    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: course,
    })
})

// @desc Add course
// @route POST /api/v1/bootcamps/:bootcampId/course/
// @access Private
exports.addCourse = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId

    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404))
    }

    // Make sure user is the bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not add a course to bootcamp ${bootcamp.id}`, 401))
    }

    const course = await Course.create(req.body)

    res.status(200).json({
        success: true,
        data: course,
    })
})

// @desc Update course
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is the bootcamp owner
    if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update course ${bootcamp.id}`, 401))
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        data: course,
    })
})

// @desc Delete course
// @route DELETE /api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id)
    // const course = await Course.findOneAndDelete({
    //     _id: req.params.id
    // })

    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
    }

     // Make sure user is the bootcamp owner
     if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete course ${bootcamp.id}`, 401))
    }

    await course.deleteOne()

    res.status(200).json({
        success: true,
        data: {},
    })
})