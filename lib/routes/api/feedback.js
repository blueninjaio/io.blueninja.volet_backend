const { Feedback } = require('../../models');

module.exports = {
  getFeedback: async (req, res) => {
    const feedbacks = await Feedback.find({});
    return res.ok('Feedbacks received', {
      feedbacks: feedbacks
    });
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