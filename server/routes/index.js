const products = require("./products");
const user = require("./user");
const section = require("./section");

module.exports = app => {
  app.use("/hpi", products);
  app.use("/hpi/admin", user);
  app.use("/hpi/sections", section);
};
