const {Bank, BusinessCategory, BusinessType, Currency} = require('../../models');

const toggle = async (req, res, model, message) => {
    let { _id, isActive } = req.body;

    let update = {
        isActive
    };
    await model.updateOne({ _id }, update);
    return res.ok(message);
};

module.exports = {
    toggleBank: async (req, res) => {
        return await toggle(req, res, Bank, 'Successfully toggled the bank status.');
    },
    toggleBusinessCategory: async (req, res) => {
        return await toggle(req, res, BusinessCategory, 'Successfully toggled the category status.');
    },
    toggleBusinessType: async (req, res) => {
        return await toggle(req, res, BusinessType, 'Successfully toggled the type status.');
    },
    toggleCurrency: async (req, res) => {
        return await toggle(req, res, Currency, 'Successfully toggled the currency status.');
    }
};