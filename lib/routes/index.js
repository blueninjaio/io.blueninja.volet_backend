const HttpStatus = require('http-status-codes');

const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  res.response = (code, message, object) => {
    return res.status(code).send(Object.assign({
      message: message,
      success: code === HttpStatus.OK
    }, object));
  };
  res.internalServerError = (message) => {
    return res.response(HttpStatus.INTERNAL_SERVER_ERROR, message || 'Server Error');
  };
  res.ok = (message, object) => {
    return res.response(HttpStatus.OK, message, object);
  };
  res.conflict = (message) => {
    return res.response(HttpStatus.CONFLICT, message || 'Error 409: Conflict');
  };
  res.badRequest = (message) => {
    return res.response(HttpStatus.BAD_REQUEST, message || 'Error 400: Bad Request');
  };
  res.unauthorized = (message) => {
    return res.response(HttpStatus.UNAUTHORIZED, message || 'Error 401: Unauthorized');
  };
  res.forbidden = (message) => {
    return res.response(HttpStatus.FORBIDDEN, message || 'Error 403: Forbidden');
  };
  next();
});
router.use('/api', require('./api'));
router.use(function (err, req, res) {
  console.error(err.stack);
  return res.internalServerError(err.message);
});

module.exports = router;
