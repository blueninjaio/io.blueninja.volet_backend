const Feedback = require('../../models/feedback');

module.exports = {
    getFeedback: async (req, res) => {
        let feedbacks = await Feedback.find({});
        return res.ok('Feedbacks received', {
            feedbacks: feedbacks
        });
    },
    createFeedback: async (req, res) => {
        let { user_id, rating, description } = req.body;

        let newFeedback = {
            user_id,
            rating,
            description
        };

        await Feedback.create(newFeedback);
        return res.ok('Successfully created the feedback.');
    }
};