const {StaticPage} = require('../../models');

edit = async (res, faq, policy) => {
    let _static = await StaticPage.find({});
    if (_static.length < 1) {
        let staticPage = {
            faq: faq,
            policies: policy
        };

        _static = StaticPage.create(staticPage);
        return {
            static: _static
        };
    }
    let update = {
        faq: faq
    };
    await StaticPage.updateOne({ '_id': _static[0]._id }, update);
};

module.exports = {
    getStaticPages: async (req) => {
        let _static = await StaticPage.find({});
        return {
            static: _static
        };
    },
    editFaq: async (req) => {
        let { faq } = req.body;
        return await edit(req, faq, '');
    },
    editPolicies: async (req) => {
        let { policy } = req.body;
        return await edit(req, '', policy);
    }
};