const { body } = require("express-validator");
const User = require("../../models/user");

const register_validate = [
  body("name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("email")
    .isEmail()
    .custom((val, { req }) => {
      const prom = User.findOne({ email: val }).then(userDoc => {
        if (userDoc) {
          return Promise.reject("E-Mail address already exists!");
        }
        return Promise.resolve("good");
      });
      return prom;
    })
    .normalizeEmail(),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 6 })
];

const login_validate = [
  body("email")
    .isEmail()
    .not()
    .isEmpty()
    .normalizeEmail(),
  body("password")
    .trim()
    .escape()
    .not()
    .isEmpty()
];
const product_validate = [
  body("title")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .isLength({ max: 2 }),
  body("price")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .isNumeric(),
  body("description")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("imageUrl")
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body("section")
    .not()
    .isEmpty()
];

module.exports = {
  register_validate,
  login_validate,
  product_validate
};
