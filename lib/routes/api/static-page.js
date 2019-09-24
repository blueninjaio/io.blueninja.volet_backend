const StaticPage = require('../../models/static');

const edit = async (res, faq, policy) => {
  let _static = await StaticPage.find({});
  if (_static.length < 1) {
    const staticPage = {
      faq: faq,
      policies: policy
    };

    _static = StaticPage.create(staticPage);
    return res.ok('Successfully created FAQ Static Page.', {
      static: _static
    });
  }
  const update = {
    faq: faq
  };
  await StaticPage.updateOne({ '_id': _static[0]._id }, update);
  return res.ok('Successfully edited FAQ Static Page.');
};

module.exports = {
  getStaticPages: async (req, res) => {
    const _static = await StaticPage.find({});
    return res.ok('Static Pages Received', {
      static: _static
    });
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
