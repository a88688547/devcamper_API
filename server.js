const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const connectDB = require("./config/db")
const errorHandler = require("./middleware/error")
const fileupload = require("express-fileupload")
const path = require("path")
const cookieParser = require("cookie-parser")
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

// Load env vars
dotenv.config({
    path: "./config/config.env"
})

// Connect to database
connectDB();
 
// Route files
const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")
const reviews = require("./routes/reviews")
const auth = require("./routes/auth")
const users = require("./routes/users")

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// File uploading
app.use(fileupload())

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 min
    max: 100,
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// app.use(logger)

// Mount routers
app.use("/api/v1/bootcamps", bootcamps)
app.use("/api/v1/courses", courses)
app.use("/api/v1/auth", auth)
app.use("/api/v1/users", users)
app.use("/api/v1/reviews", reviews)

app.use(errorHandler)

const PORT = process.env.PORT || 5050;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`)
    // Close server & exit process
    server.close(() => process.exit(1))
})