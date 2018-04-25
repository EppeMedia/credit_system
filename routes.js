const userController = require('./controllers/usercontroller.js');
const transactionController = require('./controllers/TransactionController.js');
const jwt = require('jsonwebtoken');
const config = require('./config.js');


module.exports = function (app) {
  // Present a validation token.
  app.route('/auth')
    .post(userController.login);

  app.route('/register')
    .post(userController.register);

  app.use((req, res, next) => {
    if (req.path.startsWith('/') &&
        (req.path.match(/\//g) || []).length === 1) {
      next();
      return;
    }

    const token = req.body.token || req.query.token || req.params.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
          return res.status(500).json({ succes: false, message: 'Failed to authenticate token' });
        }
        req.decode = decoded;
        next();
      });
    } else {
      return res.status(403).send({ succes: false, message: 'No token provided' });
    }
  });

  app.route('/api/transactions/:username')
      .get(transactionController.getTransactions);

  app.route('/api/transactions')
      .post(transactionController.newTransaction);

  app.route('/api/attribute')
      .post(transactionController.postAttribute);

};
