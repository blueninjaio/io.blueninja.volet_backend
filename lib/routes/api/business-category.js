const { BadRequestError } = require('../../errors');

const {BusinessCategory, Business} = require('../../models');

module.exports = {
    getBusinessCategories: async (req, res) => {
        let categories = await BusinessCategory.find({});
        return res.ok('Categories received', {
            categories: categories
        });
    },
    getBusinessCategory: async (req, res) => {
        let { name } = req.body;

        //let category = await Category.find({ name });
        let business = await Business.find({ type_of_business: name });
        if (!business) {
            throw new BadRequestError("Could not find business with type.");
        }
        return res.ok('Retrieved Businesses with that Category', {
            business: business
        });
    },
    createBusinessCategory: async (req, res) => {
        let { name, description } = req.body;

        let newCategory = {
            name,
            description,
            isActive: true
        };

        await BusinessCategory.create(newCategory);
        return res.ok(`Successfully created new category.`);
    }
};