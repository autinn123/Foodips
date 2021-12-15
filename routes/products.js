const express = require('express');
const router = express.Router();
const controller = require('../Controllers/product.controller');

router.get('/', controller.getProduct);

router.get('/:id/detail', controller.getDetailProduct);

router.get('/:category', controller.filterByCategory);

module.exports = router;
