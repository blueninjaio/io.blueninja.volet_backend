const { sign, verify, JsonWebTokenError, NotBeforeError, TokenExpiredError } = require('jsonwebtoken');
const { private_key } = require('../config');
const models = require('../models');

const handler = (...types) => {
    return async (req, res, next) => {
        let header = req.headers['authorization'];
        if (!header) {
            return res.unauthorized();
        }
        if (!header.startsWith('Bearer ')) {
            return res.bad_request('Invalid authorization header.');
        }
        let token = header.substr(7);
        try {
            let { _id, type } = verify(token, private_key);
            if (!types.includes(type)) {
                return res.forbidden();
            }
            let model = models[type];
            if (!model) {
                return res.internal_server_error(`Model ${type} is not defined.`);
            }
            let object = await models[type].findOne({ _id });
            if (!object) {
                return res.bad_request('Invalid auth token.');
            }
            req[type.toLowerCase()] = object;
            next();
        } catch (e) {
            if (e instanceof JsonWebTokenError || e instanceof NotBeforeError) {
                return res.bad_request('Invalid auth token.');
            }
            if (e instanceof TokenExpiredError) {
                return res.bad_request('Auth token has expired.');
            }
            next(e);
        }
    }
};

module.exports = {
    handler: handler,
    adminAuth: handler('Admin'),
    userAuth: handler('User'),
    merchantAuth: handler('Merchant'),
    anyAuth: handler('Admin', 'User', 'Merchant'),

    createAuthToken: (model) => {
        let keys = Object.keys(models);
        for (let i = 0; i < keys.length; i++) {
            let type = keys[i];
            if (model instanceof models[type]) {
                return sign({ _id: model._id, type }, private_key, {
                    expiresIn: 43200
                });
            }
        }
        throw new Error("Unsupported authentication model.")
    }
};