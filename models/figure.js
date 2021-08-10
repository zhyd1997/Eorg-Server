const mongoose = require("mongoose");
const { Schema } = mongoose;

const Figure = new Schema(
	{
		path: {
			type: String,
			require: true,
		},
		key: {
			type: String,
			require: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Figure", Figure);
