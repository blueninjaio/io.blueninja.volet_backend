const { Bank } = require('../../models');

module.exports = {
  getBanks: async () => {
    const banks = await Bank.find({});
    return {
      banks: banks
    };
  },
  getActiveBanks: async () => {
    const banks = await Bank.find({ isActive: true }).select('name');
    return {
      banks: banks
    };
  },
  createBank: async (req) => {
    const { name, description } = req.body;

    const newBank = {
      name,
      description
    };
    await Bank.create(newBank);
  }
};
