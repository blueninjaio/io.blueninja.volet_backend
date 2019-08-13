const Static = require('../models/Static');

edit = async (res, faq, policy) => {
    let _static = await Static.find({});
    if (_static.length < 1) {
        let staticPage = {
            faq: faq,
            policies: policy
        };

        _static = Static.create(staticPage);
        return res.ok('Successfully created FAQ Static Page.', {
            static: _static
        });
    }
    let update = {
        faq: faq
    };
    await Static.updateOne({ '_id': _static[0]._id }, update);
    return res.ok('Successfully edited FAQ Static Page.');
};

module.exports = {
    getAll: async (req, res) => {
        let _static = await Static.find({});
        return res.ok('Static Pages Received', {
            static: _static
        });
    },
    editFaq: async (req, res) => {
        let { faq } = req.body;
        return await edit(req, faq, '');
    },
    editPolicies: async (req, res) => {
        let { policy } = req.body;
        return await edit(req, '', policy);
    }
};