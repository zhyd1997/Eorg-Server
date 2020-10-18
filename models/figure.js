const mongoose = require('mongoose')
const { Schema } = mongoose

const figureSchema = new Schema({
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
		ref: 'User',
	},
})

module.exports = mongoose.model('Figure', figureSchema)