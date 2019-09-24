const BadRequest = require('./route/bad-request');

class NoResultError extends BadRequest {
  constructor(message) {
    super(message);
    this.name = 'NoResultError';
  }
}

exports = NoResultError;
