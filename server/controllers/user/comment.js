const Comment = require("../../models/comment");
const Product = require("../../models/product");

exports.postComment = async (req, res, next) => {
  try {
    const { productId, commentText } = req.body;
    // add comment to comments collection
    const comment = await new Comment({
      commentText,
      userId: req.user.id
    }).save();
    // add comment to products comments list
    const product = await Product.findById(productId);
    if (product) {
      product.addToComments(comment);
      const populatedComment = await comment
        .populate({
          path: "userId",
          select: "name email"
        })
        .execPopulate();
      res.status(201).send(populatedComment);
    } else {
      throw new Error("product was not found");
    }
  } catch (error) {
    next(error);
  }
};

exports.removeComment = async (req, res, next) => {
  try {
    // get commentId and userId inputs
    const { productId, commentId } = req.body;
    const userId = req.user.id;
    // check if userId equal to hardcoded userId
    if (userId === process.env["ADMIN_MDB_ID"]) {
      // find related post
      const post = await Product.findById(productId);
      // remove comment from it
      await post.removeComment(commentId);
      // remove comment from db by geted id
      const deletedDocumment = await Comment.findByIdAndRemove(commentId);
      // send deleted doc to response
      res.status(200).send(deletedDocumment);
    } else {
      throw new Error("no userId matched");
    }
  } catch (error) {
    next(error);
  }
};
