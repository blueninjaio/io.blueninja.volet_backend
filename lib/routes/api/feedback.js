const { Feedback } = require('../../models');

module.exports = {
  getFeedback: async () => {
    const feedbacks = await Feedback.find({});
    return {
      feedbacks: feedbacks
    };
  },
  createFeedback: async (req, res) => {
    const { rating, description } = req.body;
    const newFeedback = {
      rating,
      description
    };

    await Feedback.create(newFeedback);
    return res.ok('Successfully created the feedback.');
  }
};
