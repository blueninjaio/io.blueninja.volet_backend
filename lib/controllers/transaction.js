const {Transaction} = require('../models');

module.exports = {
    getTransactions: async (req) => {
        let { user_type } = req.params;
        let transactions = await Transaction.find({ user_type });
        return {
            transactions: transactions
        };
    },
    createTransaction: async (req) => {
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
        return {
            transaction: transaction
        };
    }
};
