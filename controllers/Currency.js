const Currency = require('../models/Currency');
const request = require('request-promise-native');
const {currency_api_key} = require('../config/config');

const requestConversion = (from, to) => {
}

module.exports = {
    getAll: (req, res) => {
        Currency.find({}, (err, currency) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    currency,
                    message: "Success: Currency received"
                });
            }
        });
    },
    create: (req, res) => {
        let {
            name,
            description,
        } = req.body;

        let newCurrency = {
            name,
            description
        };

        Currency.create(newCurrency, (err, currency) => {
            if (err) {
                return res.status(404).send({
                    success: false,
                    message: "Error: There was an error creating the currency."
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Success: Successfully created the currency."
                });
            }
        });
    },
    toggle: (req, res) => {
        let {
            _id,
            isActive
        } = req.body;

        let update = {
            isActive
        };

        Currency.updateOne({ _id }, update, (err, currency) => {
            if (err) {
                return res.status(404).send({
                    success: false,
                    message: "Error: There was an error updating the currency status."
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Success: Successfully toggled the currency status."
                });
            }
        });
    },
    convert: async (req, res) => {
        let {
            from,
            to
        } = req.body;
        if (!from || !to) {
            return res.status(400).send({
                success: false,
                message: "Error: Missing fields."
            });
        }
        let token = `${from}_${to}`;
        try {
            let result = JSON.parse(await request(`https://free.currconv.com/api/v7/convert?q=${token}&compact=ultra&apiKey=${currency_api_key}`));
            return res.status(200).send({
                success: true,
                conversion: result[token.toUpperCase()]
            });
        } catch (e) {
            return res.status(400).send({
                success: false,
                message: "Error: Could not convert currency."
            });
        }
    },
};