const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const Figure = require("../models/Figure");
const path = require("path");

/**
 * @desc    Upload image
 * @route   POST /api/v1/figure/upload
 * @access  Private
 */
exports.upload = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	try {
		await Figure.create({
			path: path.join(
				__dirname,
				"./latex/",
				user.username,
				"/images/",
				req.file.filename
			),
			key: req.body.id,
			user,
		});

		res.status(201).json({ success: true });
	} catch (err) {
		console.log(err);
		return next(new ErrorResponse(err, 500));
	}
});

/**
 * @desc    Retrieve image
 * @route   GET /api/v1/figure/:blockKey
 * @access  Private
 */
exports.retrieve = asyncHandler(async (req, res, next) => {});
