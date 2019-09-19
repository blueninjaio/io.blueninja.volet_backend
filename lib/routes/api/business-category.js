const { BadRequestError } = require('../../errors');

const {BusinessCategory, Business} = require('../../models');

module.exports = {
    getBusinessCategories: async (req) => {
        let categories = await BusinessCategory.find({});
        return {
            categories: categories
        };
    },
    getBusinessCategory: async (req) => {
        let { name } = req.body;

        //let category = await Category.find({ name });
        let business = await Business.find({ type_of_business: name });
        if (!business) {
            throw new BadRequestError("Could not find business with type.");
        }
        return {
            business: business
        };
    },
    createBusinessCategory: async (req) => {
        let { name, description } = req.body;

        let newCategory = {
            name,
            description,
            isActive: true
        };

        await BusinessCategory.create(newCategory);
    }
};