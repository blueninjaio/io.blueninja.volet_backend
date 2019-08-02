const UserTransaction = require('../models/UserTransaction');
const UserAgentTransaction = require('../models/UserAgentTransaction');
const MerchantTransaction = require('../models/MerchantTransaction');

const getTransactions = (req, res, controller) => {
  controller.find({}, (err, transactions) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: "Server Error"
      });
    } else {
      return res.status(200).send({
        success: true,
        transactions,
        message: "Success: Transactions received"
      });
    }
  });
};

const createTransaction = (req, res, controller) => {
  let object = req.body;
  object.date = new Date();
  controller.create(object, (err, transactions) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: "Server Error"
      });
    } else {
      return res.status(200).send({
        success: true,
        transactions,
        message: "Success: Created transaction."
      });
    }
  });
};

module.exports = {
  getAllUserTransactions: (req, res) => {
    return getTransactions(req, res, UserTransaction);
  },
  getAllUserAgentTransactions: (req, res) => {
    return getTransactions(req, res, UserAgentTransaction);
  },
  getAllMerchantTransactions: (req, res) => {
    return getTransactions(req, res, MerchantTransaction);
  },
  createUserTransaction: (req, res) => {
    return createTransaction(req, res, UserTransaction);
  },
  createUserAgentTransaction: (req, res) => {
    return createTransaction(req, res, UserAgentTransaction);
  },
  createMerchantTransaction: (req, res) => {
    return createTransaction(req, res, MerchantTransaction);
  }
};
