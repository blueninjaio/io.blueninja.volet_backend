const Type = require('../models/BusinessType');

module.exports = {
    getAll: async (req, res) => {
        let types = await Type.find({});
        return res.ok('Types received', {
            types: types
        });
    },
    create: async (req, res) => {
        let { name, description } = req.body;

        let newType = {
            name,
            description
        };

        await Type.create(newType);
        return res.ok(`Successfully created a new Type.`);
    }
};