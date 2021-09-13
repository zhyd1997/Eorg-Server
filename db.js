const mongoose = require("mongoose");

const db = {
  connect: async () => {
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
  },
  disconnect: (done) => {
    try {
      mongoose.disconnect(done);

      console.log("MongoDB disconnected done!");
    } catch (err) {
      console.log(`Error occurs when disconnected to MongoDB: ${err}`);
    }
  },
};

module.exports = db;
