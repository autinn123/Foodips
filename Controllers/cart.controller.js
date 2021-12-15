const Product = require('../models/product.model')
const Cart = require('../models/cart.model')

const addToCart = async (req, res, next) => {
  try {
    const addedProduct = await Product.findById(req.params.id);
    Cart.save(addedProduct)
  } catch (error) {
    
  }

}
























// const Cart = require('../models/cart.model');
// const productModel = require('../models/product.model');

// const loadCart = async (req, res) => {
//   try {
//     const userCart = await Cart.find({ _id: req.user.id });
//     const cartItems = userCart[product];
//     res.json(cartItems);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const addProduct = async (req, res) => {
//   const result = await Cart.addProductCheck(req.user.id);
//   const newProduct = req.params.productId;
//   const quantity = req.body.qty;
//   try {
//     const product = await productModel.findOne(newProduct);
//     const updatedCart = await product.addToCart(result._id, quantity);
//     res.json({ updatedCart });
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports = { loadCart, addProduct };
