const express = require("express")

const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
} = require("../controllers/courses")

const advancedResults = require("../middleware/advancedResults")
const Course = require("../modles/Course")

const router = express.Router({
    mergeParams: true,
})

const { project, authorize } = require("../middleware/auth")


router.route("/")
    .get(advancedResults(Course,{
        path: "bootcamp",
        select: "name description",
    })
        ,getCourses)
    .post(project, authorize("publisher", "admin"), addCourse)

router.route("/:id")
    .get(getCourse)
    .put(project, authorize("publisher", "admin"), updateCourse)
    .delete(project, authorize("publisher", "admin"), deleteCourse)

module.exports = router