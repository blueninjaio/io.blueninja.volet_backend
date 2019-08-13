const Volet = require('../models/Volet');

module.exports = {
    getAll: async (req, res) => {
        let volets = await Volet.find({});
        return res.ok('Volets received', {
            volets: volets
        });
    },
    create: async (req, res) => {
        let { persona_id, persona_model, amount } = req.body;


        let newVolet = {
            persona_id,
            persona_model,
            amount
        };

        await Volet.create(newVolet);
        return res.ok('Successfully created the volet.');
    },
    calculate: async (req, res) => {
        let { persona_id } = req.body;

        let volet = await Volet.find({ persona_id });
        return res.ok('Successfully received volet of Persona.', {
            volet: volet
        });
    }
};