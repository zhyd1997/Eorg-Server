const mongoose = require("mongoose");
const { Schema } = mongoose;

const Figure = new Schema(
	{
		path: {
			type: String,
			require: true,
		},
		blockKey: {
			type: String,
			require: [true, "Please add your blockKey"],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Figure", Figure);
