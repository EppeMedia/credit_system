'use strict'
const mongoose = require('mongoose');
const RSVP = require('rsvp');
const config = require('../config.js');

const User = mongoose.model('Users');

exports.getTransactions = function (req, res) {

	const username = req.params.username;

	User.findOne({username: username}).exec((err, user) => {
		if(err) return res.json({success: false, error: err});

		const transactions = user.transactions;

		if(!transactions) return res.json({success: false, error: 'No transactions found!'});

		res.json({success: true, balance: user.balance, items: transactions});
	});

};

exports.newTransaction = function (req, res) {

	const username = req.body.username;
	const amount = parseFloat(req.body.amount);
	const description = req.body.description;
	let recipientUsername = req.body.to;
	let toAdmin = false;
	let fromAdmin = false;

	if(!username || !amount){
		return res.json({success: false, error: 'Incomplete request!'});
	}

	if(!recipientUsername){
		recipientUsername = 'admin';
		toAdmin = true;
	}

	if(!description) {
		description = '-';
	}

	if (username === 'admin') {
		fromAdmin = true;
	}

	User.findOne({username: username}).exec((err, user) => {
		if(err) return res.json({success: false, error: err});

		const transactions = user.transactions;

		if(!transactions) return res.json({success: false, error: 'No transactions found!'});

		if(amount <= 0 || amount > user.balance){
			return res.json({success: false, error: 'Invalid amount!'});
		}

		if (fromAdmin) {
			//There will be no recipient: only a description and an amount!
			const newUserBalance = parseFloat(user.balance) - amount;
			const transaction = {
				from: username,
				fromNickname: user.nickname,
				to: "Outgoing",
				toNickname: "Outgoing",
				date: Date.now(),
				amount: amount,
				description: description,
				new_balance: newUserBalance
			};

			user.transactions.push(transaction);
			user.balance = newUserBalance;
			user.save();
			return res.json({success: true});
		}

		User.findOne({username: recipientUsername}).exec((err, recipient) => {
			
			if(err) return res.json({success: false, error: err});
			if(!recipient) return res.json({success: false, error: `Recipient "${recipientUsername}" not found!`});

			const newUserBalance = parseFloat(user.balance) - amount;
			const transaction = {
				from: username,
				fromNickname: user.nickname,
				to: recipient.username,
				toNickname: recipient.nickname,
				date: Date.now(),
				amount: amount,
				description: description,
				new_balance: newUserBalance
			};

			user.transactions.push(transaction);
			user.balance = newUserBalance;
			user.save();

			if (!toAdmin) {
				// Money to the admin should show up as a transaction, but may not be added to it's balance.
				const newRecipientBalance = parseFloat(recipient.balance) + amount;
				transaction.new_balance = newRecipientBalance;
				recipient.balance = newRecipientBalance;
			}
			
			recipient.transactions.push(transaction);
			recipient.save();

			return res.json({success: true});
			
		});

	});

};

exports.postAttribute = function (req, res) {

	const username = req.body.username;
	const amount = parseFloat(req.body.amount);

	if(!username || !amount){
		return res.json({success: false, error: 'Incomplete request!'});
	}

	User.findOne({username: username}).exec((err, user) => {
		if(err) return res.json({success: false, error: err});

		const transactions = user.transactions;

		if(!transactions) return res.json({success: false, error: 'No transactions found!'});

		if(amount <= 0){
			return res.json({success: false, error: 'Invalid amount!'});
		}

		const newBalance = parseFloat(user.balance) + amount;

		const transaction = {
			from: 'system',
			fromNickname: 'De Pot Admin',
			date: Date.now(),
			amount: amount,
			new_balance: newBalance
		};

		user.transactions.push(transaction);
		user.balance = newBalance;
		user.save();

		User.findOne({admin: true}).exec((err, admin) => {
			if(err) return res.json({success: false, error: err});

			admin.balance = parseFloat(admin.balance) + amount;
			transaction.new_balance = admin.balance;
			admin.transactions.push(transaction);
			admin.save();
			
		});

		res.json({success: true});
	});

}