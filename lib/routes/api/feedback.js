const { Feedback } = require('../../models');

module.exports = {
    getFeedback: async (req, res) => {
        let feedbacks = await Feedback.find({});
        return res.ok('Feedbacks received', {
            feedbacks: feedbacks
        });
    },
    createFeedback: async (req, res) => {
        let { rating, description } = req.body;

        let newFeedback = {
            rating,
            description
        };

        await Feedback.create(newFeedback);
        return res.ok('Successfully created the feedback.');
    }
};