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
    let users = await mongoose.models['User'].find({ "cart.productId": id })
    users.forEach(user => {
      user.removeFromCart(id)
    });
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

module.exports = mongoose.model('Product', productSchema);