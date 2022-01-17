const express = require('express');
const router = express.Router();

const Authenticated = require('../middleware/auth').checkAuthenticated;
const notAuthenticated = require('../middleware/auth').checkNotAuthenticated;
const controller = require('../Controllers/user.controller');
const cartController = require('../Controllers/cart.controller');
const orderController = require('../Controllers/order.controller');

//get home page- load product
router.get('/', controller.getHomePage);

//confirm email
router.get('/confirm/:confirmationCode', controller.verifyUser);

//authentication
router.get('/signup', notAuthenticated, (req, res) => {
  res.render('user/signup');
});
router.get('/signin', notAuthenticated, (req, res) => {
  res.render('user/signin');
});

//shopping cart
router.get('/shopping-cart', cartController.getShoppingCart);

router.get('/add-to-cart/:id', cartController.addToCart);

router.get('/remove/:id', cartController.removeItem);

router.get('/reduce/:id', cartController.reduceOne);

router.get('/increase/:id', cartController.increaseOne);

// checkout
router.get('/order', orderController.getOrder);

router.post('/checkout', orderController.checkout);

module.exports = router;
