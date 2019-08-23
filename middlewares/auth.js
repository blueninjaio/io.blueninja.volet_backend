const { sign, verify, TokenExpiredError } = require('jsonwebtoken');
const { private_key } = require('../config/config');
const models = require('../models');

const handler = (...types) => {
    return async (req, res, next) => {
        let token = req.headers['authorization'];
        if (!token) {
            return res.unauthorized();
        }
        if (!token.startsWith('Bearer ')) {
            return res.bad_request('Invalid authorization header.');
        }
        try {
            let decoded = verify(token.substr(7), private_key);
            let _id = decoded._id;
            let type = decoded.type;
            if (!types.includes(type)) {
                return res.forbidden();
            }
            let model = models[type];
            if (!model) {
                return res.internal_server_error(`Model ${type} is not defined.`);
            }
            req[decoded.type] = await models[type].findOne({ _id });
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                return res.bad_request('Token has expired.');
            }
            return res.bad_request('Invalid token.');
        }
        next();
    }
};

module.exports = {
    handler: handler,
    admin: handler('admin'),
    user: handler('user'),
    merchant: handler('merchant'),

    register(user) {
        let keys = Object.keys(models);
        for (let i = 0; i < keys.length; i++) {
            let type = keys[i];
            if (user instanceof models[type]) {
                return this.createToken({ _id: user._id, type });
            }
        }
        throw new Error("Unsupported authentication model.")
    },

    createToken(object, expiry) {
        return sign(object, private_key, {
            expiresIn: expiry || 43200
        });
    },
    decodeToken(token) {
        return verify(token, private_key);
    },
};