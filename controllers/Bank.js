const Bank = require('../models/Bank');

module.exports = {
    getAll: async (req, res) => {
        let banks = await Bank.find({});
        return res.ok('Banks received', {
            banks: banks
        });
    },
    create: async (req, res) => {
        let { name, description } = req.body;

        let newBank = {
            name,
            description,
        };
        await Bank.create(newBank);
        return res.ok('Successfully created the bank.');
    }
};
