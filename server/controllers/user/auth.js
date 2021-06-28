const pick = require("lodash").pick;
const bcrypt = require("bcryptjs");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const { validResult } = require("../../utils/helpers");

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
    const token = jwt.sign(
      {
        name: user.name,
        userId: user._id.toString()
      },
      "someSecret",
      { expiresIn: "72h" }
    );
    res.status(200).json({ token, userId: user._id.toString() });
  } catch (e) {
    next(e);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userId }, "name email status");
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
