const Transaction = require('../../models/transaction');

module.exports = {
  getTransactions: async (req, res) => {
    const { user_type } = req.params;
    const transactions = await Transaction.find({ user_type });
    return res.ok('Transactions received', {
      transactions: transactions
    });
  },
  createTransaction: async (req, res) => {
    const { user_type } = req.params;
    const { from, to, business, business_type, type, amount } = req.body;
    const object = {
      user_type,
      from,
      to,
      type,
      amount
    };
    if (business) {
      object.business = business;
      object.business_type = business_type;
    }
    const transaction = await Transaction.create(object);
    return res.ok('Created transaction.', {
      transaction: transaction
    });
  }
};
