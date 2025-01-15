const mongoose = require("mongoose");

const {
  getEnvironmentVariable,
  getGlobalDBUrl,
  getLocalDBUrl
} = require("../utils/helpers");

// dont forget to use Environment Variables in local machine or global

const getDbConnectionString = () => {
  if (
    getEnvironmentVariable("NODE_ENV") === "production" &&
    process.env.BUILD_FOR_PROD === "true"
  )
    return getGlobalDBUrl();
  return getLocalDBUrl();
};

module.exports = {
  async connectDb(cb) {
    console.log(getDbConnectionString());
    return mongoose.connect(
      getDbConnectionString(),
      { useNewUrlParser: true, useUnifiedTopology: true },
      err => {
        if (err) throw new Error("conection failed :(");
      }
    );
  }
};
