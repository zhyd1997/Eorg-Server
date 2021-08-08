const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const db = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});

		console.log(`MongoDB connected: ${db.connection.host}`);
	} catch (err) {
		console.log(`Error occurs when connected to MongoDB: ${err}`);
	}
};

module.exports = connectDB;
