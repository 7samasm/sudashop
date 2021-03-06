const pick = require('lodash').pick
const chalk = require('chalk')
const objectId = require('mongoose').Types.ObjectId
const isValidObjectId = require('mongoose').isValidObjectId
const emitErrors = require('../../utils/helpers').emitErrors
const {uploadFile} = require('../../utils/uploadFile')
const {setControllerPaginationLogic} = require('../products')


const Product = require('../../models/product');
const User = require('../../models/user')

exports.postAddProduct = async (ctx, next) => {
  const {request} = ctx
  const body = pick(request.body, ['title', 'price', 'description', 'imageUrl', 'section'])
   try {
    await next()
    await handleUpload(ctx, body)
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
    await handleUpload(ctx, body)
    const doc = await Product.findById(prodId)
    for (const prop in body) {
      doc.set(prop, body[prop])
    }
    const updatedDoc = await doc.save()
    ctx.status = 200
    ctx.body = updatedDoc
    // console.log(ctx.body)

  } catch (e) {
    emitErrors(ctx,e)
  }
};

exports.deleteProduct = async (ctx, next) => {
  try {
    await next()
    const userId = ctx.req.userId;
    const {request} = ctx
    const {productId} = request.body
    const doc = await Product.findById(productId)
    await doc.remove()
    await setControllerPaginationLogic(ctx,{userId},request.body)
  } catch (e) {
    emitErrors(ctx,e)
  }
};

exports.getUserProducts = async (ctx,next) => {
  const userId = ctx.req.userId;
  try {
    await next()
    if (!isValidObjectId(userId)) throw new Error('id is invalid')
    await setControllerPaginationLogic(ctx,{userId})
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

function handleUpload(ctx, body) {
  return new Promise(async (resolve,reject) => {
    try {
      const file = ctx.request.files.image
      if (file) {
        const {name,path,type,size} = file
        console.log(type,size,typeof type);
        if (type !== 'image/jpeg' && type !== 'image/png') {
          throw new Error('only support png,jpeg and jpg')
        }
        if (size > 99999) {
          throw new Error('too big image size')
        }
        const { key, url } = await uploadFile({
          fileName: name,
          filePath: path,
          fileType: type,
        })
        console.log(key, url)
        // mutate image url with requsted uploded file if found
        if (url) body.imageUrl = url
      } 
      resolve(true)
    } catch (e) {
      reject(e)
    }
  })
}
