const { isValidObjectId, Types } = require('mongoose');

const Product = require('../../models/product');
const User = require('../../models/user')


exports.getCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!isValidObjectId(userId)) throw new Error('id is invalid')
    const cart = await User.aggregate([
      //  select user who match requsted id
      { $match: { _id: Types.ObjectId(userId) } },
      // split his cart into several documonts
      { $unwind: { path: "$cart", preserveNullAndEmptyArrays: true } },
      // bring product's data for each splited document
      { $lookup: { from: "products", localField: "cart.productId", foreignField: "_id", as: "_cart" } },
      // will get singel doc cause look up applay for each ex unwind
      { $unwind: { path: "$_cart", preserveNullAndEmptyArrays: true } },
      // add quantity field to cart
      { $addFields: { "_cart.quantity": "$cart.quantity" } },
      // group spilted docs by user _id        
      {
        $group: {
          _id: "$_id",
          _cart: { $push: "$_cart" },
          totalPrice: { $sum: { $multiply: ["$_cart.price", "$_cart.quantity"] } },
          totalItems: { $sum: { $multiply: [1, "$_cart.quantity"] } }
        }
      },
      // bunddle to final output      
      {
        $project: {
          _id: 0,
          products: { $cond: [{ $eq: ["$_cart", [{}]] }, [], "$_cart"] },
          totalPrice: "$totalPrice",
          totalItems: "$totalItems"
        }
      }
    ])
    res.status(200).send([...cart][0]) 
  } catch (e) {
    next(e)
  }
}

exports.postCart = async (req, res, next) => {
  try {
    const { productId,quantity } = req.body
    // const quantity = req.body.quantity
    const user = await User.findById(req.userId)
    const product = await Product.findById(productId)
    const result = await user.addToCart(product, +quantity)
    res.status(201).send(result) 
  } catch (e) {
    next(e)
  }
};

exports.deleteCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.userId)
    await user.removeFromCart(productId)
    res.send('cart item was deleted !').status(200)
  } catch (e) {
    next(e)
  }
}