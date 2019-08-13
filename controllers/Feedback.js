const Feedback = require('../models/Feedback');

module.exports = {
    getAll: async (req, res) => {
        let feedbacks = await Feedback.find({});
        return res.ok('Feedbacks received', {
            feedbacks: feedbacks
        });
    },
    create: async (req, res) => {
        let { user_id, rating, description } = req.body;

        let newFeedback = {
            user_id,
            rating,
            description,
            dateCreated: new Date()
        };

        await Feedback.create(newFeedback);
        return res.ok('Successfully created the feedback.');
    }
};