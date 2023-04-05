const express = require("express")

const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    logout,
} = require("../controllers/auth")

const router = express.Router()

const { project } = require("../middleware/auth")

router.post("/register",register)
router.post("/login",login)
router.get("/logout", logout)
router.get("/me", project, getMe)
router.put("/updatedetails", project, updateDetails)
router.put("/updatepassword", project, updatePassword)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword/:resettoken", resetPassword)

module.exports = router
