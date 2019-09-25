const {Currency} = require('../models');
const request = require('request-promise-native');
const { currency_api_key } = require('../config');
const { BadRequestError } = require('../errors');

module.exports = {
    getCurrencies: async (req) => {
        let currencies = await Currency.find({});
        return {
            currencies: currencies
        };
    },
    getActiveCurrencies: async (req) => {
        let currencies = await Currency.find({ isActive: true }).select("name");
        return {
            currencies: currencies
        };
    },
    createCurrency: async (req) => {
        let { name, description } = req.body;

        let newCurrency = {
            name,
            description
        };

        await Currency.create(newCurrency);
    },
    convertCurrency: async (req) => {
        let { from, to } = req.body;
        if (!from || !to) {
            throw new BadRequestError('Missing fields.');
        }
        let token = `${from}_${to}`;
        try {
            let result = JSON.parse(await request(`https://free.currconv.com/api/v7/convert?q=${token}&compact=ultra&apiKey=${currency_api_key}`));
            return {
                conversion: result[token.toUpperCase()]
            };
        } catch (e) {
            throw new BadRequestError('Could not convert currency.');
        }
    }
};