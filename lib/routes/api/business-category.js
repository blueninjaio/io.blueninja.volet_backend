const Category = require('../../models/business-category');
const Business = require('../../models/business');

module.exports = {
  getBusinessCategories: async (req, res) => {
    const categories = await Category.find({});
    return res.ok('Categories received', {
      categories: categories
    });
  },
  getBusinessCategory: async (req, res) => {
    const { name } = req.body;

    //let category = await Category.find({ name });
    const business = await Business.find({ type_of_business: name });
    if (!business) {
      return res.badRequest('Could not find business with type.');
    }
    return res.ok('Retrieved Businesses with that Category', {
      business: business
    });
  },
  createBusinessCategory: async (req, res) => {
    const { name, description } = req.body;

    const newCategory = {
      name,
      description,
      isActive: true
    };

    await Category.create(newCategory);
    return res.ok('Successfully created new category.');
  }
};