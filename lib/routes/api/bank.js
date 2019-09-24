const Bank = require('../../models/bank');

module.exports = {
  getBanks: async (req, res) => {
    const banks = await Bank.find({});
    return res.ok('Banks received', {
      banks: banks
    });
  },
  getActiveBanks: async (req, res) => {
    const banks = await Bank.find({ isActive: true }).select('name');
    return res.ok('Banks received', {
      banks: banks
    });
  },
  createBank: async (req, res) => {
    const { name, description } = req.body;

    const newBank = {
      name,
      description
    };
    await Bank.create(newBank);
    return res.ok('Successfully created the bank.');
  }
};
