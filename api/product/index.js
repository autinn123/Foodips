const express = require('express');
const router = express.Router();
const productController = require('./apiProductController');
const notAuthUser = require('../../middleware/comment');

router.get('/comments/:productId/:start/:limit', productController.getComment);

router.get('/', productController.getProducts);

router.get('/:category', productController.getCategoryProducts);

router.post('/addcomment', notAuthUser, productController.addComment);

module.exports = router;
