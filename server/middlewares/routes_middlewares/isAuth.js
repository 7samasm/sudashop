const jwt = require("express-jwt");
const { JWT_SECRET } = require("../../utils/consts");
const { getEnvironmentVariable } = require("../../utils/helpers");
// const User = require("../../models/user");

const isAuth = () => {
  const secret = getEnvironmentVariable(JWT_SECRET);
  return [jwt({ secret, algorithms: ["HS256"] })];
};

module.exports = isAuth;
