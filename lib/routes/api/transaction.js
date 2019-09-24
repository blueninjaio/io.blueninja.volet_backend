const { Transaction } = require('../../models');

module.exports = {
  getTransactions: async (req) => {
    const { user_type } = req.params;
    const transactions = await Transaction.find({ user_type });
    return {
      transactions: transactions
    };
  },
  createTransaction: async (req) => {
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
    return {
      transaction: transaction
    };
  }
};
