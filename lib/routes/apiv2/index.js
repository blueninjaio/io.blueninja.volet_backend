const express = require('express');
const Joi = require('@hapi/joi');

const { adminAuth } = require('../auth');
const { changeAdminEmail2 } = require('../../controllers/admin');
const { RouteError } = require('../../errors');

const router = express.Router();

// const parameterfy = (function() {
//   const pattern = /function[^(]*\(([^)]*)\)/;
//
//   return function(func) {
//     // fails horribly for parameterless functions ;)
//     const args = func.toString().match(pattern)[1].split(/,\s*/);
//
//     return function() {
//       const named_params = arguments[arguments.length - 1];
//       if (typeof named_params === 'object') {
//         const params = [].slice.call(arguments, 0, -1);
//         if (params.length < args.length) {
//           for (var i = params.length, l = args.length; i < l; i++) {
//             params.push(named_params[args[i]]);
//           }
//           return func.apply(this, params);
//         }
//       }
//       return func.apply(null, arguments);
//     };
//   };
// }());

const handler = (schema, fn) => {
  return async (req, res, next) => {
    try {
      const object = {

      };
      return res.status(200).send(await fn(object));
    } catch (e) {
      if (e instanceof RouteError) {
        return res.status(e.statusCode).send(e.message);
      }
      next(e);
    }
  };
};

const schema = Joi.object({
  _id: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
});
router.post('/admin/changeEmail2/:_id?email=kkk', adminAuth, handler(schema, changeAdminEmail2));

router.use(function (err, req, res, next) {
  if (err instanceof RouteError) {
    return res.status(err.statusCode).send(err.message);
  }
  next(err);
});
module.exports = router;