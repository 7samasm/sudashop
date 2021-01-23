const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comments : [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      }
    ]
  },
  {timestamps : true}
);

productSchema.plugin(mongoosePaginate);

// const user     = await User.findById(req.userId)
// const userwp   = await user.populate('cart.productId').execPopulate()
//findByIdAndRemove
productSchema.pre('remove', async function(next) {
  try {
    // statements
    const id = this._id
    // remove product from all carts
    let users = await mongoose.models['User'].find({ "cart.productId": id })
    users.forEach(user => {
      user.removeFromCart(id)
    });
    // remove comments
    this.comments.forEach(async comment => {
      await mongoose.models['Comment'].findByIdAndRemove(comment)
    })
    this.comments = []
    next()
  } catch (e) {
    // statements
    next(e)
  }
})

// methods
productSchema.methods.addToComments = function (comment) {
  const commentsCopy = [...this.comments]
  commentsCopy.push(comment._id)
  this.comments = commentsCopy
  return this.save()
}
productSchema.methods.removeComment = function (id) {
  const commentsCopy = [...this.comments]
  const filtered = commentsCopy.filter((comment,index) => {
    console.log(comment)
    return comment._id.toString() !== id
  })
  this.comments = filtered
  return this.save()
}
module.exports = mongoose.model('Product', productSchema);