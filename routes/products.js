const express = require('express');
const router = express.Router();
const controller = require('../Controllers/product.controller');
const cartController = require('../Controllers/cart.controller')

router.get('/', controller.getProduct);

router.get('/:id/detail', controller.getDetailProduct);

router.get('/:category', controller.filterByCategory);

router.post('/:id/addCart', cartController.addWithQty);

module.exports = router;
