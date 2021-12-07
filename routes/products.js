const express = require('express');
const router = express.Router();
const Products = require('../models/product.model');

//All product Route

// router.get('/', paginatedResults(Products), (req, res) => {
//     res.json(res.paginatedResults);
// });

// function paginatedResults(model) {
//     return async (req, res, next) => {
//         const page = parseInt(req.query.page);
//         const limit = 8;

//         const startIndex = (page - 1) * limit;
//         const endIndex = page * limit;

//         const results = {};

//         if (endIndex < await model.countDocuments().exec()) {
//             results.next = {
//                 page: page + 1,
//                 limit: limit
//             }
//         }
//         if (startIndex > 0) {
//             results.previous = {
//                 page: page - 1,
//                 limit: limit
//             }
//         }
//         try {
//             results.results = await model.find().limit(limit).skip(startIndex).exec();
//             res.paginatedResults = results;
//             next();
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     }
// }
router.get('/', async (req, res, next) => {
  let perPage = 6; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.query.page || 1;
  let products = {};
  products = await Products.find() // find tất cả các data
    .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec();
  const count = await Products.countDocuments();
  const categorys = await Products.distinct('category');
  res.render('products/index', {
    products, // sản phẩm trên một page
    current: page, // page hiện tại
    categorys,
    category: 1,
    pages: Math.ceil(count / perPage), // tổng số các page
  });
});

router.get('/detail/:id', async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id);
    const recommendProducts = await Products.find({
      category: product.category,
      _id: { $ne: product.id },
    }).limit(4);
    res.render('products/detail', {
      product: product,
      recommendProducts: recommendProducts,
    });
  } catch (error) {
    res.redirect('/');
  }
});

router.get('/:category', async (req, res, next) => {
  let perPage = 6; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.query.page || 1;
  let category = req.params.category || null;
  if (category !== 1) {
    category = category.charAt(0).toUpperCase() + category.slice(1);
  }

  const products = await Products.find({ category: req.params.category })
    .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec();
  const count = await Products.countDocuments();
  const categorys = await Products.distinct('category');
  res.render('products/index', {
    products, // sản phẩm trên một page
    current: page, // page hiện tại
    categorys,
    category,
    pages: Math.ceil(count / perPage), // tổng số các page
  });
});

module.exports = router;
