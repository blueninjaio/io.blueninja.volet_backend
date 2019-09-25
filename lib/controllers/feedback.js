const { Feedback } = require('../models');

module.exports = {
    getFeedback: async (req) => {
        let feedbacks = await Feedback.find({});
        return {
            feedbacks: feedbacks
        };
    },
    createFeedback: async (req) => {
        let { rating, description } = req.body;

        let newFeedback = {
            rating,
            description
        };

        await Feedback.create(newFeedback);
    }
};