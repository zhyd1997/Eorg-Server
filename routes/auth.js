const express = require("express");
const {
	register,
	login,
	logout,
	getProfile,
	updatePassword,
	updateDetails,
	forgotPassword,
	resetPassword,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/updatepassword", protect, updatePassword);
router.put("/updatedetails", protect, updateDetails);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
