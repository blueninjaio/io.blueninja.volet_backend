const { Item } = require('../../models');

module.exports = {
  addItem: async (req) => {
    const { business_id, name, description, price } = req.body;
    const newItem = {
      business_id,
      name,
      description,
      price
    };

    const item = await Item.create(newItem);
    return {
      item: item
    };
  },
  removeItem: async (req) => {
    const { _id } = req.body;

    await Item.remove({ _id });
  },
  getBusinessItems: async (req) => {
    const { business_id } = req.body;

    const item = await Item.find({ business_id });
    return {
      item: item
    };
  }
};
