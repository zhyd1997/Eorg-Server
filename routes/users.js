var express = require("express");
const User = require("../models/User");
const { getUsers } = require("../controllers/users");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getUsers);

module.exports = router;
