const request = require('request-promise-native');

const { Currency } = require('../../models');
const { currency_api_key } = require('../../config');
const { BadRequestError } = require('../../errors');

module.exports = {
  getCurrencies: async () => {
    const currencies = await Currency.find({});
    return {
      currencies: currencies
    };
  },
  getActiveCurrencies: async () => {
    const currencies = await Currency.find({ isActive: true }).select('name');
    return {
      currencies: currencies
    };
  },
  createCurrency: async (req) => {
    const { name, description } = req.body;

    const newCurrency = {
      name,
      description
    };

    await Currency.create(newCurrency);
  },
  convertCurrency: async (req) => {
    const { from, to } = req.body;
    if (!from || !to) {
      throw new BadRequestError('Missing fields.');
    }
    const token = `${from}_${to}`;
    try {
      const result = JSON.parse(await request(`https://free.currconv.com/api/v7/convert?q=${token}&compact=ultra&apiKey=${currency_api_key}`));
      return {
        conversion: result[token.toUpperCase()]
      };
    } catch (e) {
      throw new BadRequestError('Could not convert currency.');
    }
  }
};
