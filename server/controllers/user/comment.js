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

exports.removeComment = async (ctx, next) => {
  try {
    await next()
    const {request,req} = ctx
    // get commentId and userId inputs
    console.log(request.body)
    const {productId,commentId} = request.body
    const userId = req.userId
    // check if userId equal to hardcoded userId
    if (userId === process.env['ADMIN_MDB_ID']) {
      // find related post
      const post = await Product.findById(productId)
      // remove comment from it
      await post.removeComment(commentId)
      // remove comment from db by geted id
      const deletedDocumment = await Comment.findByIdAndRemove(commentId)
      // send deleted doc to response 
      ctx.body = deletedDocumment
    } else {
      throw new Error('no userId matched')
    }
  } catch (error) {
    emitErrors(ctx,error)
  }
}