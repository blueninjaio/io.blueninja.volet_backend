const RouteError = require('./route-error');

class Forbidden extends RouteError {
  constructor(message) {
    super(403, message);
    this.name = 'Forbidden';
  }
}

module.exports = Forbidden;
