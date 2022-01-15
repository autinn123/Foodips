const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

const addToCart = async function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  try {
    const addedProduct = await Product.findById(productId);
    cart.add(addedProduct, addedProduct.id);
    req.session.cart = cart;
    res.redirect('/products');
  } catch (error) {
    res.status(500).json({ msg: 'error' });
  }
};

const addWithQty = async function (req, res, next) {
	var productId = req.params.id;
	var qty = req.body.qty;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	try {
	  const addedProduct = await Product.findById(productId);
	  cart.addWithQty(addedProduct, addedProduct.id, qty);
	  req.session.cart = cart;
	  res.redirect('/products');
	} catch (error) {
	  res.status(500).json({ msg: 'error' });
	}
  };

const removeItem = function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
};

const reduceOne = function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
};

const increaseOne = function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.increaseByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
};

const getShoppingCart = function (req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
};

module.exports = {
  getShoppingCart,
  increaseOne,
  reduceOne,
  addToCart,
  removeItem,
  addWithQty
};
