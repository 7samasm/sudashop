const pick = require("lodash").pick;
const objectId = require("mongoose").Types.ObjectId;
const isValidObjectId = require("mongoose").isValidObjectId;
const { uploadFile } = require("../../utils/uploadFile");
const { setControllerPaginationLogic } = require("../products");

const Product = require("../../models/product");
const User = require("../../models/user");

exports.postAddProduct = async (req, res, next) => {
  const body = pick(req.body, [
    "title",
    "price",
    "description",
    "imageUrl",
    "section"
  ]);
  try {
    // console.log(req.file);
    await handleUpload(req, body);
    const product = new Product({
      ...body,
      userId: req.userId
    });
    res.status(201).send(await product.save());
  } catch (e) {
    next(e);
  }
};

exports.putEditProduct = async (req, res, next) => {
  const body = pick(req.body, [
    "title",
    "price",
    "description",
    "imageUrl",
    "section"
  ]);
  const prodId = req.body.productId;
  try {
    await handleUpload(req, body);
    const doc = await Product.findById(prodId);
    for (const prop in body) {
      doc.set(prop, body[prop]);
    }
    res.status(201).send(await doc.save());
  } catch (e) {
    next(e);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    const doc = await Product.findById(productId);
    await doc.remove();
    await setControllerPaginationLogic(req, res, { userId }, req.body);
  } catch (e) {
    next(e);
  }
};

exports.getUserProducts = async (req, res, next) => {
  const userId = req.userId;
  try {
    if (!isValidObjectId(userId)) throw new Error("id is invalid");
    await setControllerPaginationLogic(req, res, { userId });
  } catch (e) {
    next(e);
  }
};

exports.getUserProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (objectId.isValid(id)) {
      const userProds = await Product.findOne({ _id: id, userId: req.userId });
      res.status(200).send(userProds);
    } else {
      res.send(false);
    }
  } catch (e) {
    next(e);
  }
};

exports.userInfos = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!objectId.isValid(userId)) throw new Error("id is invalid");
    const stat = await User.aggregate([
      //  select user who match requsted id
      { $match: { _id: objectId(userId) } },
      // split his cart into several documonts
      {
        $unwind: {
          path: "$cart",
          preserveNullAndEmptyArrays: true
        }
      },
      // bring product's data for each splited document
      {
        $lookup: {
          from: "products",
          localField: "cart.productId",
          foreignField: "_id",
          as: "_cart"
        }
      },
      // will get singel doc cause look up applay for each ex unwind
      {
        $unwind: {
          path: "$_cart",
          preserveNullAndEmptyArrays: true
        }
      },
      // add quantity field to cart
      { $addFields: { "_cart.quantity": "$cart.quantity" } },
      // group spilted docs by user _id
      {
        $group: {
          _id: {
            _id: "$_id",
            user: {
              id: "$_id",
              name: "$name",
              email: "$email"
            }
          },
          _cart: { $push: "$_cart" },
          totalPrice: {
            $sum: { $multiply: ["$_cart.price", "$_cart.quantity"] }
          },
          totalItems: { $sum: { $multiply: [1, "$_cart.quantity"] } }
        }
      },
      // bunddle to final output
      {
        $project: {
          _id: 0,
          user: "$_id.user",
          cartShape: {
            products: { $cond: [{ $eq: ["$_cart", [{}]] }, [], "$_cart"] },
            totalPrice: "$totalPrice",
            totalItems: "$totalItems"
          }
        }
      }
    ]).exec();

    Product.find({ userId }, (err, docs) => {
      res
        .send({
          user: stat[0].user,
          cart: stat[0].cartShape,
          products: docs
        })
        .status(200);
    });
  } catch (e) {
    next(e);
  }
};

function handleUpload(req, body) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.file) {
        const { filename, path, mimetype } = req.file;
        const { key, url } = await uploadFile({
          fileName: filename,
          filePath: path,
          fileType: mimetype
        });
        console.log(key, url);
        // mutate image url with requsted uploded file if found
        if (url) body.imageUrl = url;
      }
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}
