const express = require('express');
const router = express.Router();
const productController = require('./apiProductController');
const notAuthUser = require('../../middleware/comment');

router.get('/:productId', productController.getComment);

router.post('/addcomment', notAuthUser, productController.addComment);



module.exports = router;
