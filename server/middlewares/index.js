const { json } = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

module.exports = app => {
  const cors = require("cors");
  app.use(compression());
  app.use(json({ urlencoded: true }));
  app.use(cookieParser());
};
