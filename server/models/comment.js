const { Schema, model } = require('mongoose')

const commentSchema = new Schema(
  {
    commentText: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

module.exports = model('Comment', commentSchema);
