const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  userName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  address: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Active'],
    default: 'Pending',
  },
  confirmationCode: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model('User', userSchema);
