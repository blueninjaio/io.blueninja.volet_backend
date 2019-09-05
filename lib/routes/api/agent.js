const Agent = require('../../models/agent');

module.exports = {
    /**
     |--------------------------------------------------
     | Admin: Get All Agents (POST)
     |--------------------------------------------------
     */
    getAgents: async (req, res) => {
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
    createAgent: async (req, res) => {
        let newAgent = {
            user_id: req.user._id
        };

        await Agent.create(newAgent);
        return res.ok('Agent Proposal successfully created.');
    },
    /**
     |--------------------------------------------------
     | Admin: Approve Agent -> Update User Model -> Create Log (POST)
     |--------------------------------------------------
     */
    approveAgent: async (req, res) => {
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
    declineAgent: async (req, res) => {
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