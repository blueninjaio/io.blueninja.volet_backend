const { BusinessType } = require('../../models');

module.exports = {
  getBusinessTypes: async () => {
    const types = await BusinessType.find({});
    return {
      types: types
    };
  },
  createBusinessType: async (req, res) => {
    const { name, description } = req.body;

    const newType = {
      name,
      description
    };

    await BusinessType.create(newType);
    return res.ok('Successfully created a new Type.');
  }
};
