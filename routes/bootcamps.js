const express = require("express")

const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload,
} = require("../controllers/bootcamps")

const advancedResults = require("../middleware/advancedResults")
const Bootcamp = require("../modles/Bootcamp")

// Include other resource routers
const courseRouter = require("./courses")
const reviewRouter = require("./reviews")

const router = express.Router()

const { project, authorize } = require("../middleware/auth")

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter)
router.use("/:bootcampId/reviews", reviewRouter)

router.route("/radius/:zipcode/:distance")
    .get(getBootcampsInRadius)

router
    .route("/")
    .get(advancedResults(Bootcamp, "courses"), getBootcamps)
    .post(project, authorize("publisher", "admin"), createBootcamp)

router
    .route("/:id")
    .get(getBootcamp)
    .put(project, authorize("publisher", "admin"), updateBootcamp)
    .delete(project, authorize("publisher", "admin"), deleteBootcamp)

router
    .route("/:id/photo")
    .put(project, authorize("publisher", "admin"), bootcampPhotoUpload)

module.exports = router