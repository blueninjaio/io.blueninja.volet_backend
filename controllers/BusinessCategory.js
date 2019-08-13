const Category = require('../models/BusinessCategory');
const Business = require('../models/Business');

module.exports = {
    getAll: async (req, res) => {
        let categories = await Category.find({});
        return res.ok('Categories received', {
            categories: categories
        });
    },
    get: async (req, res) => {
        let { name } = req.body;

        //let category = await Category.find({ name });
        let business = await Business.find({ type_of_business: name });
        if (!business) {
            return res.bad_request("Could not find business with type.")
        }
        return res.ok('Retrieved Businesses with that Category', {
            business: business
        });
    },
    create: async (req, res) => {
        let { name, description } = req.body;

        let newCategory = {
            name,
            description,
            isActive: true
        };

        await Category.create(newCategory);
        return res.ok(`Successfully created new category.`);
    }
};