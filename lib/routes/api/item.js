const Item = require('../../models/item');

module.exports = {
    addItem: async (req, res) => {
        let { business_id, name, description, price } = req.body;


        let newItem = {
            business_id,
            name,
            description,
            price
        };

        let item = await Item.create(newItem);
        return res.ok('Successfully added the item.', {
            item: item
        });
    },
    removeItem: async (req, res) => {
        let { _id } = req.body;

        await Item.remove({ _id });
        return res.ok('Successfully removed the item.');
    },
    /**
     |--------------------------------------------------
     | Mobile + Admin: View Items of a business (POST)
     |--------------------------------------------------
     */
    getBusinessItems: async (req, res) => {
        let { business_id } = req.body;

        let item = await Item.find({ business_id });
        return res.ok('Successfully received items of that business.', {
            item: item
        });
    }
};