const { sign, verify, JsonWebTokenError, NotBeforeError, TokenExpiredError } = require('jsonwebtoken');
const { private_key } = require('../config');
const models = require('../models');

const handler = (...types) => {
  return async (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return res.unauthorized();
    if (!header.startsWith('Bearer ')) return res.badRequest('Invalid authorization header.');
    const token = header.substr(7);
    try {
      const { _id, type } = verify(token, private_key);
      if (!types.includes(type)) return res.forbidden();

      const model = models[type];
      if (!model) return res.internalServerError(`Model ${type} is not defined.`);

      const object = await models[type].findOne({ _id });
      if (!object) return res.badRequest('Invalid auth token.');

      req[type.toLowerCase()] = object;
      next();
    } catch (e) {
      if (e instanceof JsonWebTokenError || e instanceof NotBeforeError) return res.badRequest('Invalid auth token.');

      if (e instanceof TokenExpiredError) return res.badRequest('Auth token has expired.');
      next(e);
    }
  };
};

module.exports = {
  handler: handler,
  adminAuth: handler('Admin'),
  userAuth: handler('User'),
  merchantAuth: handler('Merchant'),
  anyAuth: handler('Admin', 'User', 'Merchant'),

  createAuthToken: (model) => {
    const keys = Object.keys(models);
    for (let i = 0; i < keys.length; i++) {
      const type = keys[i];
      if (model instanceof models[type]) {
        return sign({ _id: model._id, type }, private_key, {
          expiresIn: 43200
        });
      }
    }
    throw new Error('Unsupported authentication model.');
  }
};
