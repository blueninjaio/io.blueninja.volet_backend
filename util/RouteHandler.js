const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');

const { private_key } = require('../config/Config');

module.exports = function (...types) {
    return async (req, res, next) => {
        res.response = (code, message, object) => {
            let newObject = {};
            if (object !== undefined) {
                for (let k in object) {
                    newObject[k] = object[k];
                }
            }
            newObject.message = message;
            newObject.success = code === HttpStatus.OK;
            return res.status(code).send(newObject);
        };
        res.internal_server_error = (message) => {
            return res.response(HttpStatus.INTERNAL_SERVER_ERROR, message || "Server Error");
        };
        res.ok = (message, object) => {
            return res.response(HttpStatus.OK, message, object);
        };
        res.conflict = (message) => {
            return res.response(HttpStatus.CONFLICT, message || "Error 409: Conflict");
        };
        res.bad_request = (message) => {
            return res.response(HttpStatus.BAD_REQUEST, message || "Error 400: Bad Request");
        };
        res.unauthorized = (message) => {
            return res.response(HttpStatus.UNAUTHORIZED, message || "Error 401: Unauthorized");
        };
        res.forbidden = (message) => {
            return res.response(HttpStatus.FORBIDDEN, message || "Error 403: Forbidden");
        };
        try {
            if (types.length !== 0) {
                let token = req.headers['authorization'];
                if (!token) {
                    return res.forbidden('No token provided.');
                }
                let decoded = jwt.verify(token.substr('Bearer '.length), private_key);
                if (!types.includes(decoded.type)) {
                    return res.forbidden('Failed to authenticate token.');
                }
                req.decoded = decoded;
            }
            await next();
        } catch (e) {
            return res.internal_server_error(e.message);
        }
    }
};