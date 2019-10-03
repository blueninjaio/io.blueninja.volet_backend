const { BadRequestError } = require('../errors');

const { BusinessCategory, Business } = require('../models');

module.exports = {
  getBusinessCategories: async (req) => {
    const categories = await BusinessCategory.find({});
    return {
      categories: categories
    };
  },
  getBusinessCategory: async (req) => {
    const { name } = req.body;

    //let category = await Category.find({ name });
    const business = await Business.find({ type_of_business: name });
    if (!business) {
      throw new BadRequestError('Could not find business with type.');
    }
    return {
      business: business
    };
  },
  createBusinessCategory: async (req) => {
    const { name, description } = req.body;

    const newCategory = {
      name,
      description,
      isActive: true
    };

    await BusinessCategory.create(newCategory);
  }
};