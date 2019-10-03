const { StaticPage } = require('../models');

async function edit(res, faq, policy) {
  let _static = await StaticPage.find({});
  if (_static.length < 1) {
    const staticPage = {
      faq: faq,
      policies: policy
    };

    _static = StaticPage.create(staticPage);
    return {
      static: _static
    };
  }
  const update = {
    faq: faq
  };
  await StaticPage.updateOne({ '_id': _static[0]._id }, update);
}

module.exports = {
  getStaticPages: async (req) => {
    const _static = await StaticPage.find({});
    return {
      static: _static
    };
  },
  editFaq: async (req) => {
    const { faq } = req.body;
    return await edit(req, faq, '');
  },
  editPolicies: async (req) => {
    const { policy } = req.body;
    return await edit(req, '', policy);
  }
};