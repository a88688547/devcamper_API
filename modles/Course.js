const mongoose = require("mongoose")

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [ true, "Please add a course title"],
    },
    description: {
        type: String,
        required: [ true, "Please add a course description"],
    },
    weeks: {
        type: Number,
        required: [ true, "Please add a number of week"],
    },
    tuition: {
        type: Number,
        required: [ true, "Please add a number of cost"],
    },
    minimumSkill: {
        type: String,
        required: [ true, "Please add a number of skill"],
        enum: ["beginner", "intermediate", "advanced"]
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        required: true,
    }
})

// STatic method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: {
                "bootcamp": bootcampId,
            },
        },
        {
            $group: {
                _id: "$bootcamp",
                averageCost: { $avg: "$tuition" },
            }
        }
    ])

    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        })
    } catch (error) {
        console.log(error);
    }
}

// Call getAverageCost after save
CourseSchema.post("save", function () {
    this.constructor.getAverageCost(this.bootcamp)
})

// Call getAverageCost before remove
CourseSchema.pre("deleteOne", { document: true }, function () {
    this.constructor.getAverageCost(this.bootcamp)
})

// CourseSchema.pre("deleteOne", { document: true } , async function(next) {
//     console.log(`Courses being removed from bootcamp ${this._id}`)
//     next()
// });

module.exports = mongoose.model("Course", CourseSchema)