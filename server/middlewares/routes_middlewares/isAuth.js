const jwt = require("jsonwebtoken");
// const User = require("../../models/user");

const isAuth = (req, res, next) => {
  const authHeader = req.get("x-Auth");
  if (!authHeader) {
    const error = new Error("No auth header dedected.");
    error.statusCode = 401;
    throw error;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(authHeader, "someSecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};

module.exports = isAuth;
