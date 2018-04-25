const mongoose = require('mongoose');

const Transaction = new mongoose.Schema({
	amount: Number,
	new_balance: Number,
	from: String,
	fromNickname: String,
  to: String,
  toNickname: String,
  description: String,
	date: Number
});

const User = new mongoose.Schema({
  username: String,
  password: String,
  nickname: String,
  balance: Number,
  admin: Boolean,
  transactions: [Transaction]
});

mongoose.exports = mongoose.model('Users', User);