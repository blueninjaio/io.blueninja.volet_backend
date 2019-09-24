const Bank = require('../../models/bank');
const BusinessCategory = require('../../models/business-category');
const BusinessType = require('../../models/business-type');
const Currency = require('../../models/currency');
const PaymentMethod = require('../../models/payment-method');

const toggle = async (req, res, model, message) => {
  const { _id, isActive } = req.body;

  const update = {
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
  },
  togglePaymentMethod: async (req, res) => {
    return await toggle(req, res, PaymentMethod, 'Successfully toggled the payment method status.');
  }
};