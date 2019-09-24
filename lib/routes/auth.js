const { sign, verify, JsonWebTokenError, NotBeforeError, TokenExpiredError } = require('jsonwebtoken');
const { private_key } = require('../config');
const models = require('../models');
const { BadRequestError, ForbiddenError, UnauthorizedError } = require('../errors');

const handler = (...types) => {
    return async (req, res, next) => {
        let header = req.headers['authorization'];
        try {
            if (!header) {
                throw new UnauthorizedError("Missing authorization header.");
            }
            if (!header.startsWith('Bearer ')) {
                throw new BadRequestError('Invalid authorization header.');
            }
            let token = header.substr(7);
            let { _id, type } = verify(token, private_key);
            if (!types.includes(type)) {
                throw new ForbiddenError();
            }
            let model = models[type];
            if (!model) {
                throw new BadRequestError(`Model ${type} is not defined.`);
            }
            let object = await models[type].findOne({ _id });
            if (!object) {
                throw new BadRequestError('Invalid auth token.');
            }
            req[type.toLowerCase()] = object;
            next();
        } catch (e) {
            if (e instanceof JsonWebTokenError || e instanceof NotBeforeError) {
                next(new BadRequestError('Invalid auth token.'));
            }
            if (e instanceof TokenExpiredError) {
                next(new BadRequestError('Auth token has expired.'));
            }
            next(e);
        }
    };
};

module.exports = {
    handler: handler,
    adminAuth: handler('Admin'),
    userAuth: handler('User'),
    anyAuth: handler('Admin', 'User'),

    createAuthToken: (model) => {
        let keys = Object.keys(models);
        for (let i = 0; i < keys.length; i++) {
            let type = keys[i];
            if (model instanceof models[type]) {
                return sign({ _id: model._id, type }, private_key, {});
            }
        }
        throw new Error("Unsupported authentication model.");
    }
};