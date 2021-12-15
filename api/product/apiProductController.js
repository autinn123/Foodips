const Comment = require('../../models/comment.model');

const addComment = async (req, res) => {
  const userId = req.user._id;
  const { content, productId } = req.body;
  try {
    const newComment = await Comment.create({
      userId,
      productId,
      content,
    });
    res.status(201).json({ msg: 'success' });
  } catch (error) {
    res.status(500).json({ msg: 'Can not add comment now!' });
  }
};

const getComment = async (req, res) => {
  const productId = req.params.productId;
  Comment.getComment(productId, (err, commentData) => {
    if (err) {
      res.status(500).json({ msg: 'error' });
    } else {
      res.status(200).json({ msg: 'success', data: commentData });
    }
  });
};

module.exports = { addComment, getComment };
