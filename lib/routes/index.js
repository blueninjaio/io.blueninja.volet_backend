const HttpStatus = require('http-status-codes');

const express = require('express');
const router = express.Router();
const { RouteError } = require('../errors');

router.use((req, res, next) => {
  res.response = (code, message, object) => {
    return res.status(code).send(Object.assign({
      message: message,
      success: code === HttpStatus.OK
    }, object));
  };
  next();
});
router.use('/api', require('./api'));
router.use(function (err, req, res) {
  if (err instanceof RouteError) {
    return res.status(err.statusCode).send({
      message: err.message,
      success: false
    });
  }
  console.error(err.stack);
  return res.response(HttpStatus.INTERNAL_SERVER_ERROR, err.message);
});

module.exports = router;
