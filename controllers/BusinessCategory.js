const Category = require('../models/BusinessCategory');
const Business = require('../models/Business');

module.exports = {
    getAll: (req, res) => {
        Category.find({}, (err, categories) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    categories,
                    message: "Success: Categories received"
                })
            }
        })
    },
    get: (req, res) => {
        let { name } = req.body;

        Category.find({ name }, (err, category) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was an error check if the category exists."
                });
            } else {
                Business.find({ type_of_business: name }, (err, business) => {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: "Error: There was an error matching the business with type."
                        });
                    } else {
                        return res.status(200).send({
                            success: true,
                            business,
                            message: "Success: Retrieved Businesses with that Category"
                        })
                    }
                })
            }
        })
    },
    create: (req, res) => {
        let {
            name
        } = req.body;

        let newCategory = {
            name,
            isActive: true
        };

        Category.create(newCategory, (err, category) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was an error adding the category. Please try again in a bit."
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: `Success: Successfully created new category.`
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

        Category.updateOne({ _id }, update, (err, currency) => {
            if (err) {
                return res.status(404).send({
                    success: false,
                    message: "Error: There was an error updating the category status."
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Success: Successfully toggled the category status."
                })
            }
        })
    }
};