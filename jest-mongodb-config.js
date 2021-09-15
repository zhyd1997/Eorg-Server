module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true,
    },
    instance: {},
    autoStart: false,
  },
  mongoURLEnvName: "MONGO_URI",
};
