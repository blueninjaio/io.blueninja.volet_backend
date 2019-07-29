const Currency = require('../models/Currency');

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
                })
            }
        })
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
                })
            }
        })
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
                })
            }
        })
    }
};