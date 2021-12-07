const express = require('express');
const router = express.Router();
const Products = require('../models/product.model');
const User = require('../models/user.model');

const Authenticated = require('../middleware/auth').checkAuthenticated;
const notAuthenticated = require('../middleware/auth').checkNotAuthenticated;

router.get('/', async (req, res) => {
  const products = await Products.find().limit(6).exec();
  res.render('index', {
    products,
  });
});

//authentication

router.get('/signup', notAuthenticated, (req, res) => {
  res.render('user/signup');
});

router.get('/signin', notAuthenticated, (req, res) => {
  res.render('user/signin');
});

module.exports = router;
