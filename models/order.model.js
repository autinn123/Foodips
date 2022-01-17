const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
	name: { type: String, required: true },
	email: {type: String, required: true},
	address: { type: String, required: true },
	phone: { type: String, required: true },
	products: [{ item: {type: mongoose.SchemaTypes.ObjectId, ref: 'Product' }, 
qty: { type: Number }, price: { type: Number }}],
	totalPrice: { type: Number, required: true},
	createdAt: { type: Date, required: true, default: Date.now },
	status: { type: Number, required: true, default: 0}
});

module.exports = mongoose.model ('Order', orderSchema);