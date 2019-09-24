const RouteError = require('./route-error');

class BadRequest extends RouteError {
  constructor(message) {
    super(400, message);
    this.name = 'BadRequest';
  }
}

module.exports = BadRequest;
