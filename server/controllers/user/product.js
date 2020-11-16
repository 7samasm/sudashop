const pick = require('lodash').pick
const objectId = require('mongoose').Types.ObjectId
const isValidObjectId = require('mongoose').isValidObjectId
const emitErrors = require('../../utils/helpers').emitErrors
const {_12_ROW_PER_PAGE} = require('../../utils/consts')


const Product = require('../../models/product');
const User = require('../../models/user')

exports.postAddProduct = async (ctx, next) => {
  const {request} = ctx
  const body = pick(request.body, ['title', 'price', 'description', 'imageUrl', 'section'])
  // mutate image url with requsted uploded file if found
  // if (req.file) body.imageUrl = req.file.filename
  try {
    await next()
    const product = new Product({
      ...body,
      userId: ctx.userId
    });
    ctx.status = 201
    ctx.body = await product.save()
    console.dir(ctx.req.userId + ' mm')
  } catch (e) {
    emitErrors(ctx,e)
  }
};

exports.putEditProduct = async (ctx, next) => {
  const {request} = ctx
  const body = pick(request.body, ['title', 'price', 'description', 'imageUrl', 'section'])
  const prodId = request.body.productId;
  try {
    await next()
    // mutate image url with requsted uploded file if found
    // if (req.file) body.imageUrl = req.file.filename
    const doc = await Product.findById(prodId)
    for (const prop in body) {
      doc.set(prop, body[prop])
    }
    const updatedDoc = await doc.save()
    ctx.status = 200
    ctx.body = updatedDoc
    console.log(ctx.body)

  } catch (e) {
    emitErrors(ctx,e)
  }
};

exports.deleteProduct = async (ctx, next) => {
  try {
    await next()
    const {request} = ctx
    const prodId = request.params.prodId
    const doc = await Product.findById(prodId)
    doc.remove()
    ctx.status = 200
    ctx.body   = doc
  } catch (e) {
    emitErrors(ctx,e)
  }
};

exports.getUserProducts = async (ctx,next) => {
  const {req,query} = ctx
  const userId = req.userId;
  try {
    await next()
    if (!isValidObjectId(userId)) throw new Error('id is invalid')
    const docs = await Product.paginate(
      { userId },
      {
        limit : +query.limit || _12_ROW_PER_PAGE,
        page: +query.page || 1
      }
    )
    ctx.status = 200
    ctx.body = docs
    
  } catch (e) {
    emitErrors(ctx,e)
  }
}

exports.getUserProduct = async (ctx, next) => {
  try {
    await next()
    const {request,req} = ctx
    const { id } = request.params;
    if (objectId.isValid(id)) {
      const userProds = await Product.findOne({ _id: id, userId: req.userId })
      ctx.status = 200
      ctx.body = userProds
    } else {
      ctx.body = false
    }
  } catch (e) {
    emitErrors(ctx,e)
  }
};

exports.userInfos = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!objectId.isValid(userId)) throw new Error('id is invalid')
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
          totalPrice: { $sum: { $multiply: ["$_cart.price", "$_cart.quantity"] } },
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
    ]).exec()

    Product.find({ userId }, (err, docs) => {
      res.send({
        user: stat[0].user,
        cart: stat[0].cartShape,
        products: docs
      }).status(200)
    })
  }
  catch (e) {
    next(e)
  };
};