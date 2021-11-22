const pick = require("lodash").pick;
const bcrypt = require("bcryptjs");
const { randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const chalk = require('chalk')

const User = require("../../models/user");
const RefreshToken = require("../../models/refreshToken");
const { validResult, getEnvironmentVariable } = require("../../utils/helpers");
const {
  JWT_SECRET,
  JWT_EXPIRE_OPTION,
  TOKEN_EXPIRE_IN
} = require("../../utils/consts");

exports.signUp = async (req, res, next) => {
  try {
    // get body values
    const body = pick(req.body, ["name", "email", "password"]);
    // check if inputs are valid
    validResult(req);
    // hashing password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    // mutate body's password whith hashedPassword
    body.password = hashedPassword;
    const user = new User(body);
    res.status(201).send(await user.save());
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    // get requested email and password
    const { email, password } = pick(req.body, ["email", "password"]);
    // check if inputs are valid
    validResult(req);
    // get user by requested email and check if its found
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    /*
      compare requested plain password whith user hashed pass 
      which i get from db and check it they're equil
    */
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }
    // sign new token
    const token = generateJwtToken(user);
    // sign new refresh token
    const refreshToken = await generateRefreshToken(user, req.ip).save();
    // set coockie
    setRefreshTokenCookie(res, refreshToken);
    //tokenExpiration in seconds 4h * 60m * 60s
    res.status(200).json({
      userId: user._id.toString(),
      name : user.name,
      email : user.email,
      status : user.status,
      token,
      tokenExpireIn: TOKEN_EXPIRE_IN,
      refreshToken: refreshToken.token,
    });
  } catch (e) {
    next(e);
  }
};

exports.refreshToken = async (req, res, next) => {
  // console.log(JSON.parse(atob(req.cookies.next-auth.session-token)))
  try {
    const tokenFromCookies = req.cookies.refresh_token;
    let refresh_token = tokenFromCookies;
    if (!tokenFromCookies) {
      refresh_token = req.query.refresh_token
    }
    console.log(refresh_token);
    const ipAddress = req.ip;
    const refreshToken = await RefreshToken.findOne({
      token: refresh_token
    }).populate("user");
    console.log(chalk.bgHex('#f00').white('[[refreshToken is ]]'),refreshToken)
    if (!refreshToken || !refreshToken.isActive)
      throw new Error("Invalid token");
    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const token = generateJwtToken(user);

    // set coockie
    setRefreshTokenCookie(res, newRefreshToken);
    //tokenExpiration in seconds 4h * 60m * 60s
    res.status(200).json({
      token,
      userId: user._id.toString(),
      name : user.name,
      email : user.email,
      status : user.status,
      tokenExpireIn: TOKEN_EXPIRE_IN,
      refreshToken: newRefreshToken.token
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id }, "name email status");
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

function generateJwtToken(user) {
  return jwt.sign(
    {
      name: user.name,
      id: user._id.toString()
    },
    getEnvironmentVariable(JWT_SECRET),
    { expiresIn: JWT_EXPIRE_OPTION }
  );
}

function generateRefreshToken(user, ipAddress) {
  return new RefreshToken({
    user: user._id,
    token: randomBytes(40).toString("hex"),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress
  });
}

function setRefreshTokenCookie(res, { token, expires }) {
  const setCookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  res.cookie("refresh_token", token, setCookieOptions);
}
/*
const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("_helpers/db");

module.exports = {
  authenticate,
  refreshToken,
  revokeToken,
  getAll,
  getById,
  getRefreshTokens
};

async function authenticate({ username, password, ipAddress }) {
  const user = await db.User.findOne({ username });

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw "Username or password is incorrect";
  }

  // authentication successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(user);
  const refreshToken = generateRefreshToken(user, ipAddress);

  // save refresh token
  await refreshToken.save();

  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: refreshToken.token
  };
}

async function refreshToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(user, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(user);

  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: newRefreshToken.token
  };
}

async function revokeToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
}

async function getAll() {
  const users = await db.User.find();
  return users.map(x => basicDetails(x));
}

async function getById(id) {
  const user = await getUser(id);
  return basicDetails(user);
}

async function getRefreshTokens(userId) {
  // check that user exists
  await getUser(userId);

  // return refresh tokens for user
  const refreshTokens = await db.RefreshToken.find({ user: userId });
  return refreshTokens;
}

// helper functions

async function getUser(id) {
  if (!db.isValidId(id)) throw "User not found";
  const user = await db.User.findById(id);
  if (!user) throw "User not found";
  return user;
}

async function getRefreshToken(token) {
  const refreshToken = await db.RefreshToken.findOne({ token }).populate(
    "user"
  );
  if (!refreshToken || !refreshToken.isActive) throw "Invalid token";
  return refreshToken;
}

function generateJwtToken(user) {
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ sub: user.id, id: user.id }, config.secret, {
    expiresIn: "15m"
  });
}

function generateRefreshToken(user, ipAddress) {
  // create a refresh token that expires in 7 days
  return new db.RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress
  });
}

function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}

function basicDetails(user) {
  const { id, firstName, lastName, username, role } = user;
  return { id, firstName, lastName, username, role };
}*/

//************************************************************************* */

/*const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const validateRequest = require("_middleware/validate-request");
const authorize = require("_middleware/authorize");
const Role = require("_helpers/role");
const userService = require("./user.service");

// routes
router.post("/authenticate", authenticateSchema, authenticate);
router.post("/refresh-token", refreshToken);
router.post("/revoke-token", authorize(), revokeTokenSchema, revokeToken);
router.get("/", authorize(Role.Admin), getAll);
router.get("/:id", authorize(), getById);
router.get("/:id/refresh-tokens", authorize(), getRefreshTokens);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  const { username, password } = req.body;
  const ipAddress = req.ip;
  userService
    .authenticate({ username, password, ipAddress })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
}

function refreshToken(req, res, next) {
  const token = req.cookies.refreshToken;
  const ipAddress = req.ip;
  userService
    .refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
}

function revokeTokenSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().empty("")
  });
  validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
  // accept token from request body or cookie
  const token = req.body.token || req.cookies.refreshToken;
  const ipAddress = req.ip;

  if (!token) return res.status(400).json({ message: "Token is required" });

  // users can revoke their own tokens and admins can revoke any tokens
  if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .revokeToken({ token, ipAddress })
    .then(() => res.json({ message: "Token revoked" }))
    .catch(next);
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
  // regular users can get their own record and admins can get any record
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .getById(req.params.id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(next);
}

function getRefreshTokens(req, res, next) {
  // users can get their own refresh tokens and admins can get any user's refresh tokens
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .getRefreshTokens(req.params.id)
    .then(tokens => (tokens ? res.json(tokens) : res.sendStatus(404)))
    .catch(next);
}

// helper functions

function setTokenCookie(res, token) {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
  res.cookie("refreshToken", token, cookieOptions);
}*/
