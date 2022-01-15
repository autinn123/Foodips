const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = require('../models/cart.model');

const productSchema = new Schema({
  name: { type: String, required: true },
  cover: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: 0, default: 0 },
  status: { type: Number, required: true, default: 1 },
  activeFlag: { type: Number, required: 0, default: 1 },
});


productSchema.statics.getProducts =  function (category, start, limit, cb) {
	this.model('Product')
	  .find({ category })
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

productSchema.methods.findSimilarCategory = function findSimilarType(cb) {
  return this.model('Product').find(
    { category: this.category, _id: { $ne: this._id } },
    cb
  );
};

productSchema.methods.addToCart = async function (cartId, quantity) {
  try {
    const userCart = await Cart.findOne({ _id: cartId });

    const newItem = {
      item: this._id,
      qty: quantity,
      price: quantity * Number(this.price),
    };

    userCart.products.push(newItem);
    userCart.save();
    return userCart;
  } catch (error) {
    console.log(error);
    return -1;
  }
};

module.exports = mongoose.model('Product', productSchema);
