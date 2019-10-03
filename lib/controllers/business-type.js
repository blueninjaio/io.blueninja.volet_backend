const { BusinessType } = require('../models');

module.exports = {
  getBusinessTypes: async (req) => {
    const types = await BusinessType.find({});
    return {
      types: types
    };
  },
  createBusinessType: async (req) => {
    const { name, description } = req.body;

    const newType = {
      name,
      description
    };

    await BusinessType.create(newType);
  }
};