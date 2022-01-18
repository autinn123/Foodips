const Comment = require('../../models/comment.model');
const Products = require('../../models/product.model');
const { v4: uuidv4 } = require('uuid');

const addComment = async (req, res) => {
  const userId = req.user ? req.user._id : undefined;
  const { content, productId, userName } = req.body;
  let tempUser = {};
  if(userName) {
	  //create user
	   tempUser = {
		  userId: uuidv4(),
		  userName
	  }
	}
  try {
    const newComment = await Comment.create({
      userId: tempUser.userId ? tempUser.userId : userId,
      productId,
      content,
    });
    res.status(201).json({ msg: 'success' });
  } catch (error) {
	console.log(error);
    res.status(500).json({ msg: 'Can not add comment now!' });
  }
};

const getComment = async (req, res) => {
  const productId = req.params.productId;
  const start = parseInt(req.params.start);
  const limit = parseInt(req.params.limit);
  Comment.getComment(productId, start, limit, (err, commentData) => {
    if (err) {
      res.status(500).json({ msg: 'error' });
    } else {
      res.status(200).json({ msg: 'success', data: commentData });
    }
  });
};

const getProducts = async(req, res)  => {
  let perPage = 6; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.query.page > 0  ? req.query.page : 1;
  let products = {};
  const orderBy = req.query.order;

  let query = Products.find();

	if(orderBy == 'asc') {
		query.sort({ price: 1 })
	} 

	if(orderBy == 'desc') {
		query.sort({ price: -1 })
	} 

  if (req.query.name != null && req.query.name != '') {
	query = query.regex('name', new RegExp(req.query.name, 'i'))
}


try {
	products = await query.skip(perPage * page - perPage) 
	  .limit(perPage)
	  .exec();
	
	  res.status(200).json({ msg: 'success', data: products });
} catch (error) {
	res.status(500).json({ msg: 'error' });
}

}

const getCategoryProducts = async(req, res)  => {
	let perPage = 3; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.query.page > 0  ? req.query.page : 1;
  let category = req.params.category || null;
  if (category !== 1) {
    category = category.charAt(0).toUpperCase() + category.slice(1);
  }
  try {
	  products = await Products.find({ category }) // find tất cả các data
		.skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
		.limit(perPage)
		.exec();
		
		res.status(200).json({ msg: 'success', data: products });
  } catch (error) {
	res.status(500).json({ msg: 'error' });
  }
}


module.exports = { addComment, getComment, getProducts, getCategoryProducts };
