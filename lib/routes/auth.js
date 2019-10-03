const { sign, verify, JsonWebTokenError, NotBeforeError, TokenExpiredError } = require('jsonwebtoken');
const { private_key } = require('../config');
const models = require('../models');
const { BadRequestError, ForbiddenError, UnauthorizedError } = require('../errors');
const asyncWrapper = require('./async-wrapper');

function _verify(token) {
  try {
    return verify(token, private_key);
  } catch (e) {
    if (e instanceof JsonWebTokenError || e instanceof NotBeforeError) {
      throw new BadRequestError('Invalid auth token.');
    }
    if (e instanceof TokenExpiredError) {
      throw new BadRequestError('Auth token has expired.');
    }
    throw e;
  }
}

const handler = (...types) => {
  return asyncWrapper(async (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) {
      throw new UnauthorizedError('Missing authorization header.');
    }
    if (!header.startsWith('Bearer ')) {
      throw new BadRequestError('Invalid authorization header.');
    }
    const token = header.substr(7);
    const { _id, type } = _verify(token, private_key);
    if (!types.includes(type)) {
      throw new ForbiddenError();
    }
    const model = models[type];
    if (!model) {
      throw new BadRequestError(`Model ${type} is not defined.`);
    }
    const object = await models[type].findOne({ _id });
    if (!object) {
      throw new BadRequestError('Invalid auth token.');
    }
    req[type.toLowerCase()] = object;
    next();
  });
};

module.exports = {
  handler: handler,
  adminAuth: handler('Admin'),
  userAuth: handler('User'),
  anyAuth: handler('Admin', 'User'),

  createAuthToken: (model) => {
    const keys = Object.keys(models);
    for (let i = 0; i < keys.length; i++) {
      const type = keys[i];
      if (model instanceof models[type]) {
        return sign({ _id: model._id, type }, private_key, {});
      }
    }
    throw new Error('Unsupported authentication model.');
  }
};