const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

/**
 * @desc Get all users
 * @route GET /api/v1/users
 * @access Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({ success: true, count: users.length, data: users });
});
