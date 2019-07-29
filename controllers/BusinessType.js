const Type = require('../models/BusinessType');

module.exports = {
    getAll: (req, res) => {
        Type.find({}, (err, types) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    types,
                    message: "Success: Types received"
                })
            }
        })
    },
    create: (req, res) => {
        let {
            name
        } = req.body;

        let newType = {
            name
        };

        Type.create(newType, (err, type) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was an error adding the type. Please try again in a bit."
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: `Success: Successfully created a new Type.`
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

        Type.updateOne({ _id }, update, (err, currency) => {
            if (err) {
                return res.status(404).send({
                    success: false,
                    message: "Error: There was an error updating the type status."
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Success: Successfully toggled the type status."
                })
            }
        })
    }
};