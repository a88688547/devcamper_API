const express = require("express")

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews")

const advancedResults = require("../middleware/advancedResults")
const Review = require("../modles/Review")

const router = express.Router({
    mergeParams: true,
})

const { project, authorize } = require("../middleware/auth")


router.route("/")
    .get(advancedResults(Review,{
        path: "bootcamp",
        select: "name description",
    })
        ,getReviews)
    .post(project, authorize("admin", "user"), addReview)

router.route("/:id")
    .get(getReview)
    .put(project, authorize("user", "admin"), updateReview)
    .delete(project, authorize("user", "admin"), deleteReview)

module.exports = router