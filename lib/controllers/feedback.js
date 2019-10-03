const { Feedback } = require('../models');

module.exports = {
  getFeedback: async (req) => {
    const feedbacks = await Feedback.find({});
    return {
      feedbacks: feedbacks
    };
  },
  createFeedback: async (req) => {
    const { rating, description } = req.body;

    const newFeedback = {
      rating,
      description
    };

    await Feedback.create(newFeedback);
  }
};