const Type = require('../../models/business-type');

module.exports = {
  getBusinessTypes: async (req, res) => {
    const types = await Type.find({});
    return res.ok('Types received', {
      types: types
    });
  },
  createBusinessType: async (req, res) => {
    const { name, description } = req.body;

    const newType = {
      name,
      description
    };

    await Type.create(newType);
    return res.ok('Successfully created a new Type.');
  }
};