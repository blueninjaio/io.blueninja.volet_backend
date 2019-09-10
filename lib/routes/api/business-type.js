const {BusinessType} = require('../../models');

module.exports = {
    getBusinessTypes: async (req, res) => {
        let types = await BusinessType.find({});
        return res.ok('Types received', {
            types: types
        });
    },
    createBusinessType: async (req, res) => {
        let { name, description } = req.body;

        let newType = {
            name,
            description
        };

        await BusinessType.create(newType);
        return res.ok(`Successfully created a new Type.`);
    }
};