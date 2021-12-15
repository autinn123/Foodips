const Products = require('../models/product.model');

const getProduct = async (req, res, next) => {
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
};

const getDetailProduct = async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id);

    const recommendProducts = await product.findSimilarCategory().limit(4);

    res.render('products/detail', {
      product: product,
      recommendProducts: recommendProducts,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
};

const filterByCategory = async (req, res, next) => {
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
};

module.exports = { getProduct, getDetailProduct, filterByCategory };
