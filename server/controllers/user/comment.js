
const Comment = require('../../models/comment')
const Product = require('../../models/product')
const {emitErrors} = require('../../utils/helpers')

exports.postComment = async (ctx, next) => {
  try {
    await next()
    const {request,req} = ctx
    const { productId, commentText } = request.body
    // add comment to comments collection
    const comment = await new Comment({
      commentText,
      userId: req.userId
    }).save()
    // add comment to products comments list
    const product = await Product.findById(productId)
    if (product) {
      product.addToComments(comment)
      const populatedComment = await comment.populate({
        path: 'userId',
        select: 'name email'
      }).execPopulate()
      ctx.status = 201
      ctx.body = populatedComment
      // res.status(201).send(populatedComment)
    } else {
      throw new Error('product was not found')
    }
  } catch (error) {
    emitErrors(ctx,error)
  }

}