const Products = require('../models/product.model');

const getProduct = async (req, res, next) => {
  let perPage = 6; 
  let page = req.query.page || 1;


  	let query =  Products.find() 
	let countDoc = Products.find() 
    

	if (req.query.name != null && req.query.title != '') {
		query = query.regex('name', new RegExp(req.query.name, 'i'))
		countDoc = countDoc.regex('name', new RegExp(req.query.name, 'i'))
	}
	try {

		const products = await query.skip(perPage * page - perPage) 
		.limit(perPage)

		const all = await countDoc.exec();

		const count = all.length;
	  
		const categorys = await Products.distinct('category');
	  
		res.render('products/index', {
		  products, // sản phẩm trên một page
		  current: page, // page hiện tại
		  categorys,
		  category: 1,
		  pages: Math.ceil(count / perPage), // tổng số các page
		  searchOptions: req.query
		});
		
	} catch (error) {
		console.log(error);
	}
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
  let perPage = 3; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.query.page || 1;
  let category = req.params.category || null;
  if (category !== 1) {
    category = category.charAt(0).toUpperCase() + category.slice(1);
  }

  const query =  Products.find({ category: req.params.category })

let countDoc = Products.find({ category: req.params.category }) 

if (req.query.name != null && req.query.title != '') {
	query = query.regex('name', new RegExp(req.query.name, 'i'))
	countDoc = countDoc.regex('name', new RegExp(req.query.name, 'i'))
}

try {

	const products = await query.skip(perPage * page - perPage) 
		.limit(perPage)

	const all = await countDoc.exec();

	const count = all.length || 0;
  
	const categorys = await Products.distinct('category');
  
	res.render('products/index', {
	  products, // sản phẩm trên một page
	  current: page, // page hiện tại
	  categorys,
	  category,
	  pages: Math.ceil(count / perPage), // tổng số các page
	  searchOptions: req.query
	});
	
} catch (error) {
	
}
};

module.exports = {
  getProduct,
  getDetailProduct,
  filterByCategory,
};
