const request = require('request-promise-native');
const Currency = require('../../models/currency');
const { currency_api_key } = require('../../config');

module.exports = {
  getCurrencies: async (req, res) => {
    const currencies = await Currency.find({});
    return res.ok('Currency received', {
      currencies: currencies
    });
  },
  createCurrency: async (req, res) => {
    const { name, description } = req.body;

    const newCurrency = {
      name,
      description
    };

    await Currency.create(newCurrency);
    return res.ok('Successfully created the currency.');
  },
  convertCurrency: async (req, res) => {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.badRequest('Missing fields.');
    }
    const token = `${from}_${to}`;
    try {
      const result = JSON.parse(await request(`https://free.currconv.com/api/v7/convert?q=${token}&compact=ultra&apiKey=${currency_api_key}`));
      return res.ok({
        conversion: result[token.toUpperCase()]
      });
    } catch (e) {
      return res.badRequest('Could not convert currency.');
    }
  }
};
