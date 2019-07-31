const Volet = require('../models/Volet');

module.exports = {
    getAll: (req, res) => {
        Volet.find({}, (err, volets) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    volets,
                    message: "Success: Volets received"
                });
            }
        });
    },
    create: (req, res) => {
        let {
            persona_id,
            persona_model,
            amount,
        } = req.body;


        let newVolet = {
            persona_id,
            persona_model,
            amount
        };

        Volet.create(newVolet, (err, volet) => {
            if (err) {
                return res.status(404).send({
                    success: false,
                    message: "Error: There was an error creating the volet."
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Success: Successfully created the volet."
                });
            }
        });
    },
    calculate: (req, res) => {
        let {
            persona_id,
        } = req.body;

        Volet.find({ persona_id }, (err, volet) => {
            if (err) {
                return res.status(404).send({
                    success: false,
                    message: "Error: There was an error creating the volet."
                });
            } else {
                return res.status(200).send({
                    success: true,
                    volet,
                    message: "Success: Successfully received volet of Persona."
                });
            }
        });
    }
};