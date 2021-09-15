const path = require("path");
const fs = require("fs");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const Figure = require("../models/Figure");

/**
 * @desc    Upload image
 * @route   POST /api/v1/figures/upload
 * @access  Private
 */
exports.upload = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const { blockKey } = req.body;

  if (!blockKey) {
    return next(new ErrorResponse("Please add a blockKey", 403));
  }

  try {
    await Figure.create({
      path: `./latex/${user.username}/images/${req.file.filename}`,
      blockKey,
      user,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(err, 400));
  }
});

/**
 * @desc    Retrieve image
 * @route   GET /api/v1/figures/:blockKey
 * @access  Private
 */
exports.retrieve = asyncHandler(async (req, res, next) => {
  const figure = await Figure.find({ blockKey: req.params.blockKey });

  try {
    fs.readFile(path.join(__dirname, figure[0].path), (err, data) => {
      res.status(200).send(data);
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
});
