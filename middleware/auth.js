const User = require("../modles/User")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const jwt = require("jsonwebtoken")

// Project routes (Token 驗證)
exports.project = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1]
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token
  }

  // Make sure token exist
  if (!token) {
    return next(new ErrorResponse(`No authorize to access this route`, 401))
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)
    
    next()
  } catch (error) {
    return next(new ErrorResponse(`No authorize to access this route`, 401))
  }
})

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is no authorized to  access this route`, 403))
    }
    next()
  }
}