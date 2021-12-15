const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

const User = require('../models/user.model');

const Authenticated = require('../middleware/auth').checkAuthenticated;
const notAuthenticated = require('../middleware/auth').checkNotAuthenticated;
const controller = require('../Controllers/user.controller');

router.get('/', async (req, res) => {
  const products = await Product.find().limit(6).exec();
  res.render('index', {
    products,
  });
});

router.get('/confirm/:confirmationCode', controller.verifyUser);

//authentication

router.get('/signup', notAuthenticated, (req, res) => {
  res.render('user/signup');
});

router.get('/signin', notAuthenticated, (req, res) => {
  res.render('user/signin');
});

//add to cart
router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/products');
  });
});

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

module.exports = router;
