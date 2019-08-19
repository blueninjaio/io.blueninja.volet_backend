const Transaction = require('../models/Transaction');

module.exports = {
    getAllTransactions: async (req, res) => {
        let { user_type } = req.params;
        let transactions = await Transaction.find({ user_type });
        return res.ok('Transactions received', {
            transactions: transactions
        });
    },
    createTransaction: async (req, res) => {
        let { user_type } = req.params;
        let { from, to, business, business_type, type, amount } = req.body;
        let object = {
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
        let transaction = await Transaction.create(object);
        return res.ok('Created transaction.', {
            transaction: transaction
        });
    }
};
