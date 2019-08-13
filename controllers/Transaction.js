const UserTransaction = require('../models/UserTransaction');
const UserAgentTransaction = require('../models/UserAgentTransaction');
const MerchantTransaction = require('../models/MerchantTransaction');

const getTransactions = async (req, res, controller) => {
    let transactions = await controller.find({});
    return res.ok('Transactions received', {
        transactions: transactions
    });
};

const createTransaction = async (req, res, controller) => {
    let { from, to, business, bType, type, amount } = req.body;
    let object = {
        from,
        to,
        type,
        amount,
        date: new Date()
    };
    if (business) {
        object.business = business;
        object.bType = bType;
    }
    let transaction = await controller.create(object);
    return res.ok('Created transaction.', {
        transaction: transaction
    });
};

module.exports = {
    getAllUserTransactions: async (req, res) => {
        return await getTransactions(req, res, UserTransaction);
    },
    getAllUserAgentTransactions: async (req, res) => {
        return await getTransactions(req, res, UserAgentTransaction);
    },
    getAllMerchantTransactions: async (req, res) => {
        return await getTransactions(req, res, MerchantTransaction);
    },
    createUserTransaction: async (req, res) => {
        return await createTransaction(req, res, UserTransaction);
    },
    createUserAgentTransaction: async (req, res) => {
        return await createTransaction(req, res, UserAgentTransaction);
    },
    createMerchantTransaction: async (req, res) => {
        return await createTransaction(req, res, MerchantTransaction);
    }
};
