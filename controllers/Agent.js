const Agent = require('../models/Agent');

module.exports = {
    /**
     |--------------------------------------------------
     | Admin: Get All Agents (POST)
     |--------------------------------------------------
     */
    getAll: async (req, res) => {
        let agents = await Agent.find({});
        return res.ok('Agents successfully received.', {
            agents: agents
        });
    },
    /**
     |--------------------------------------------------
     | Mobile: Create Agent with Pending Status (POST)
     |--------------------------------------------------
     */
    create: async (req, res) => {
        let { user_id } = req.body;

        let newAgent = {
            user_id
        };

        await Agent.create(newAgent);
        return res.ok('Agent Proposal successfully created.');
    },
    /**
     |--------------------------------------------------
     | Admin: Approve Agent -> Update User Model -> Create Log (POST)
     |--------------------------------------------------
     */
    approve: async (req, res) => {
        let { user_id } = req.body;

        let update = {
            isPending: false,
            isDeclined: false,
            isApproved: true
        };

        await Agent.updateOne({ user_id }, update);
        return res.ok('Agent successfully approved.');
    },
    /**
     |--------------------------------------------------
     | Admin: Decline Agent -> Create Log (POST)
     |--------------------------------------------------
     */
    decline: async (req, res) => {
        let { user_id } = req.body;

        let update = {
            isPending: false,
            isApproved: false,
            isDeclined: true
        };

        await Agent.updateOne({ user_id }, update);
        return res.ok('Agent successfully declined.');
    }
};