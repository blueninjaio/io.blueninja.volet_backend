const Agent = require('../models/Agent');

module.exports = {
    /**
     |--------------------------------------------------
     | Admin: Get All Agents (POST)
     |--------------------------------------------------
     */
    getAll: (req, res) => {
        Agent.find({}, (err, agent) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was an error creating user agent. Please try again later"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    agent,
                    message: "Sucess: Agents successfully received."
                });
            }
        });
    },
    /**
     |--------------------------------------------------
     | Mobile: Create Agent with Pending Status (POST)
     |--------------------------------------------------
     */
    create: (req, res) => {
        let {
            user_id
        } = req.body;

        let newAgent = {
            user_id
        };

        Agent.create(newAgent, (err, agent) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was an error creating user agent. Please try again later"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Sucess: Agent Proposal successfully created."
                });
            }
        });
    },
    /**
     |--------------------------------------------------
     | Admin: Approve Agent -> Update User Model -> Create Log (POST)
     |--------------------------------------------------
     */
    approve: (req, res) => {
        let {
            user_id
        } = req.body;

        let update = {
            isPending: false,
            isDeclined: false,
            isApproved: true
        };

        Agent.updateOne({ user_id }, update, (err, agent) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was an error approving user agent. Please try again later"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Sucess: Agent successfully approved."
                });
            }
        });
    },
    /**
     |--------------------------------------------------
     | Admin: Decline Agent -> Create Log (POST)
     |--------------------------------------------------
     */
    decline: (req, res) => {
        let {
            user_id
        } = req.body;

        let update = {
            isPending: false,
            isApproved: false,
            isDeclined: true
        };

        Agent.updateOne({ user_id }, update, (err, agent) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was an error declining user agent. Please try again later"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Sucess: Agent successfully declined."
                });
            }
        });
    }
};