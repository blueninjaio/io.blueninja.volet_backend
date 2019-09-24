const Item = require('../../models/item');

module.exports = {
  addItem: async (req, res) => {
    const { business_id, name, description, price } = req.body;


    const newItem = {
      business_id,
      name,
      description,
      price
    };

    const item = await Item.create(newItem);
    return res.ok('Successfully added the item.', {
      item: item
    });
  },
  removeItem: async (req, res) => {
    const { _id } = req.body;

    await Item.remove({ _id });
    return res.ok('Successfully removed the item.');
  },
  /**
     |--------------------------------------------------
     | Mobile + Admin: View Items of a business (POST)
     |--------------------------------------------------
     */
  getBusinessItems: async (req, res) => {
    const { business_id } = req.body;

    const item = await Item.find({ business_id });
    return res.ok('Successfully received items of that business.', {
      item: item
    });
  }
};