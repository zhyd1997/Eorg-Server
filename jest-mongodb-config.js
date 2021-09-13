module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true,
    },
    instance: {},
    autoStart: false,
  },
  mongoURLEnvName: process.env.MONGO_URI,
};
