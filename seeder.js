const fs = require("fs")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

// Load env vars
dotenv.config({ 
    path: "./config/config.env" 
})

// Load models
const Bootcamp = require("./modles/Bootcamp")
const Course = require("./modles/Course")
const User = require("./modles/user")
const Review = require("./modles/review")

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
)

const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
)

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
)

const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
)

// Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
        await Review.create(reviews)
        console.log("Data Imported....")
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

// Delete data
const DeleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log("Data Destroyed....")
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

if (process.argv[2] === "-i") {
    importData()
} else if (process.argv[2] === "-d") {
    DeleteData()
}