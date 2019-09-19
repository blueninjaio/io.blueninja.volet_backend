const {BusinessType} = require('../../models');

module.exports = {
    getBusinessTypes: async (req) => {
        let types = await BusinessType.find({});
        return {
            types: types
        };
    },
    createBusinessType: async (req) => {
        let { name, description } = req.body;

        let newType = {
            name,
            description
        };

        await BusinessType.create(newType);
    }
};