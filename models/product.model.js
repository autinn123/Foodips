const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    cover: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    discount: { type: Number, required: 0, default: 0 },
    status: { type: Number, required: true, default: 1 },
    activeFlag: { type: Number, required: 0, default: 1 }
});

module.exports = mongoose.model('product', productSchema);
