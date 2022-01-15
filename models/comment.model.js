const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  productId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

// cartSchema.virtual('tolalPrice').get(function() {

// })

commentSchema.statics.getComment = function (productId, start, limit, cb) {
  this.model('Comment')
    .find({ productId })
    .populate('userId', 'userName')
    .sort({ createdAt: -1 })
    .skip(start)
    .limit(limit)
    .exec((error, commentList) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, commentList);
      }
    });
};

commentSchema.statics.getCommentAsync = function (productId, start, limit) {
	return this.model('Comment')
	  .find({ productId })
	  .populate('userId', 'userName')
	  .sort({ createdAt: -1 })
	  .skip(start)
	  .limit(limit)
	  .exec()
  };

commentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Comment', commentSchema);
