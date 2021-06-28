const express = require("express");
const isAuth = require("../middlewares/routes_middlewares/isAuth");
const { userController } = require("../controllers/user");
const {
  login_validate,
  register_validate,
  product_validate
} = require("../middlewares/routes_middlewares/inputsValidations");

const addFilesToReq = require("../middlewares/routes_middlewares/addFilesToRequest");

const router = express.Router();
// cart
router.get("/cart", isAuth, userController.getCart);
router.post("/cart", isAuth, userController.postCart);
router.delete("/cart/:productId", isAuth, userController.deleteCartItem);
//comments
router.post("/comment", isAuth, userController.postComment);
router.post("/delete-comment", isAuth, userController.removeComment);
// products
router.post(
  "/add-product",
  isAuth,
  addFilesToReq(),
  product_validate,
  userController.postAddProduct
);
router.put(
  "/edit-product",
  isAuth,
  addFilesToReq(),
  product_validate,
  userController.putEditProduct
);
router.post("/delete-product", isAuth, userController.deleteProduct);
router.get("/products", isAuth, userController.getUserProducts);
router.get("/products/:id", isAuth, userController.getUserProduct);

// auth
router.post("/signup", register_validate, userController.signUp);
router.post("/login", login_validate, userController.login);
router.get("/user", isAuth, userController.getUser);

module.exports = router;
