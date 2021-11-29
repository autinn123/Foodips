const express = require('express');
const router = express.Router();
const Products = require('../models/product.model');

router.get('/', async (req, res) => {
    const products = await Products
        .find()
        .limit(6)
        .exec();
    res.render('index', {
        products
    })
})

module.exports = router;