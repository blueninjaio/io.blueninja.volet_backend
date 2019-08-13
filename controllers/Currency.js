const Currency = require('../models/Currency');
const request = require('request-promise-native');
const { currency_api_key } = require('../config/config');

module.exports = {
    getAll: async (req, res) => {
        let currencies = await Currency.find({});
        return res.ok('Currency received', {
            currencies: currencies
        });
    },
    create: async (req, res) => {
        let { name, description } = req.body;

        let newCurrency = {
            name,
            description
        };

        await Currency.create(newCurrency);
        return res.ok('Successfully created the currency.');
    },
    convert: async (req, res) => {
        let { from, to } = req.body;
        if (!from || !to) {
            return res.bad_request('Missing fields.');
        }
        let token = `${from}_${to}`;
        try {
            let result = JSON.parse(await request(`https://free.currconv.com/api/v7/convert?q=${token}&compact=ultra&apiKey=${currency_api_key}`));
            return res.ok({
                conversion: result[token.toUpperCase()]
            });
        } catch (e) {
            return res.bad_request('Could not convert currency.');
        }
    },
};