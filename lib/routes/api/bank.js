const {Bank} = require('../../models');

module.exports = {
    getBanks: async (req) => {
        let banks = await Bank.find({});
        return {
            banks: banks
        };
    },
    getActiveBanks: async (req) => {
        let banks = await Bank.find({ isActive: true }).select("name");
        return {
            banks: banks
        };
    },
    createBank: async (req) => {
        let { name, description } = req.body;

        let newBank = {
            name,
            description
        };
        await Bank.create(newBank);
    }
};
