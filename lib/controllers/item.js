const {Item} = require('../models');

module.exports = {
    addItem: async (req) => {
        let { business_id, name, description, price } = req.body;


        let newItem = {
            business_id,
            name,
            description,
            price
        };

        let item = await Item.create(newItem);
        return {
            item: item
        };
    },
    removeItem: async (req) => {
        let { _id } = req.body;

        await Item.remove({ _id });
    },
    /**
     |--------------------------------------------------
     | Mobile + Admin: View Items of a business (POST)
     |--------------------------------------------------
     */
    getBusinessItems: async (req) => {
        let { business_id } = req.body;

        let item = await Item.find({ business_id });
        return {
            item: item
        };
    }
};