const Bank = require('../models/Bank');
const BusinessCategory = require('../models/BusinessCategory');
const BusinessType = require('../models/BusinessType');
const Currency = require('../models/Currency');
const PaymentMethod = require('../models/PaymentMethod');

const toggle = async (req, res, model, message) => {
    let { _id, isActive } = req.body;

    let update = {
        isActive
    };
    await model.updateOne({ _id }, update);
    return res.ok(message);
};

module.exports = {
    bank: async (req, res) => {
        return await toggle(req, res, Bank, 'Successfully toggled the bank status.');
    },
    businessCategory: async (req, res) => {
        return await toggle(req, res, BusinessCategory, 'Successfully toggled the category status.');
    },
    businessType: async (req, res) => {
        return await toggle(req, res, BusinessType, 'Successfully toggled the type status.');
    },
    currency: async (req, res) => {
        return await toggle(req, res, Currency, 'Successfully toggled the currency status.');
    },
    paymentMethod: async (req, res) => {
        return await toggle(req, res, PaymentMethod, 'Successfully toggled the payment method status.');
    }
};