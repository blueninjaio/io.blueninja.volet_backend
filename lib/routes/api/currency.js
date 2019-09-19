const {Currency} = require('../../models');
const request = require('request-promise-native');
const { currency_api_key } = require('../../config');
const { BadRequestError } = require('../../errors');

module.exports = {
    getCurrencies: async (req, res) => {
        let currencies = await Currency.find({});
        return res.ok('Currency received', {
            currencies: currencies
        });
    },
    getActiveCurrencies: async (req, res) => {
        let currencies = await Currency.find({ isActive: true }).select("name");
        return res.ok('Currency received', {
            currencies: currencies
        });
    },
    createCurrency: async (req, res) => {
        let { name, description } = req.body;

        let newCurrency = {
            name,
            description
        };

        await Currency.create(newCurrency);
        return res.ok('Successfully created the currency.');
    },
    convertCurrency: async (req, res) => {
        let { from, to } = req.body;
        if (!from || !to) {
            throw new BadRequestError('Missing fields.');
        }
        let token = `${from}_${to}`;
        try {
            let result = JSON.parse(await request(`https://free.currconv.com/api/v7/convert?q=${token}&compact=ultra&apiKey=${currency_api_key}`));
            return res.ok({
                conversion: result[token.toUpperCase()]
            });
        } catch (e) {
            throw new BadRequestError('Could not convert currency.');
        }
    }
};