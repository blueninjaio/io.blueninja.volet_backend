const auth = require('./auth');
const TYPE = {
    REGISTER: 0,
    FORGET_PASSWORD: 1,
    RESET_PASSWORD: 2
};
const handler = (tac_type) => {
    return async (req, res, next) => {
        let { token } = req.body;
        let { type, contact, tac_code } = auth.decodeToken(token);
        if (type !== tac_type || (req.user && contact !== req.user.contact)) {
            return res.bad_request('Invalid tac token.');
        }
        req.contact = contact;
        next();
    };
};

module.exports = {
    TYPE: Object.freeze(TYPE),
    handler: handler,
    register: handler(TYPE.REGISTER),
    forgetPassword: handler(TYPE.FORGET_PASSWORD),
    resetPassword: handler(TYPE.RESET_PASSWORD),
};