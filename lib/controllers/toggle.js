const {Bank, BusinessCategory, BusinessType, Currency} = require('../models');

const toggle = async (req, model) => {
    let { _id, isActive } = req.body;

    let update = {
        isActive
    };
    await model.updateOne({ _id }, update);
};

module.exports = {
    toggleBank: async (req) => {
        return await toggle(req, Bank);
    },
    toggleBusinessCategory: async (req) => {
        return await toggle(req, BusinessCategory);
    },
    toggleBusinessType: async (req) => {
        return await toggle(req, BusinessType);
    },
    toggleCurrency: async (req) => {
        return await toggle(req, Currency);
    }
};