const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const User = new Schema(
	{
		username: {
			type: String,
			required: [true, "Please add a username"],
		},
		email: {
			type: String,
			required: [true, "Please add an email"],
			unique: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please add a valid email",
			],
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		password: {
			type: String,
			required: [true, "Please add a password"],
			minlength: 6,
			select: false,
		},
		resetPasswordToken: String,
		resetPasswordExpired: Date,
	},
	{ timestamps: true }
);

// Encrypt password using bcrypt
User.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
User.methods.getSignedJwt = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Match user entered password to hashed password in DB
User.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
User.methods.getResetPasswordToken = async function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString("hex");

	// Hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	// Set expired
	this.resetPasswordExpired = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model("User", User);
