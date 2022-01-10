const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

//add to cart
router.get('/add-to-cart/:id', async function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  try {
    const addedProduct = await Product.findById(productId);
    cart.add(addedProduct, addedProduct.id);
    req.session.cart = cart;
    res.status(200).json({ msg: 'success' });
  } catch (error) {
    res.status(500).json({ msg: 'error' });
  }
});
//get data
router.get('/carts', async function (req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  try {
    res.status(200).json({ msg: 'success', data: cart.generateArray() });
  } catch (error) {
    res.status(500).json({ msg: 'error' });
  }
});

module.exports = router;
