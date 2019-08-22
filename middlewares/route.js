const HttpStatus = require("http-status-codes");
const auth = require("./auth");
const mcache = require("memory-cache");

module.exports = {
    handler: async (req, res, next) => {
        res.response = (code, message, object) => {
            return res.status(code).send(Object.assign({
                message: message,
                success: code === HttpStatus.OK
            }, object));
        };
        res.internal_server_error = (message) => {
            return res.response(HttpStatus.INTERNAL_SERVER_ERROR, message || 'Server Error');
        };
        res.ok = (message, object) => {
            return res.response(HttpStatus.OK, message, object);
        };
        res.conflict = (message) => {
            return res.response(HttpStatus.CONFLICT, message || 'Error 409: Conflict');
        };
        res.bad_request = (message) => {
            return res.response(HttpStatus.BAD_REQUEST, message || 'Error 400: Bad Request');
        };
        res.unauthorized = (message) => {
            return res.response(HttpStatus.UNAUTHORIZED, message || 'Error 401: Unauthorized');
        };
        res.forbidden = (message) => {
            return res.response(HttpStatus.FORBIDDEN, message || 'Error 403: Forbidden');
        };
        try {
            await next();
        } catch (e) {
            return res.internal_server_error(e.message);
        }
    },
    auth:  (types) => {
        return async (req, res, next) => {
            if (types.length !== 0) {
                let result = await auth.authenticate(req, res, types);
                if (result) {
                    return res.bad_request(result);
                }
            }
            await next();
        };
    },
    tac: (tac_type) => {
        return async (req, res, next) => {
            let { token } = req.body;
            let { type, contact, tac_code } = auth.decodeToken(token);
            console.log(type, tac_type, contact);
            if (type !== tac_type || (req.user && contact !== req.user.contact)) {
                return res.bad_request('Invalid token.');
            }
            req.contact = contact;
            await next();
        };
    },
    cache: (seconds) => {
        return async (req, res, next) => {
            let key = "__express__" + req.originalUrl || req.url;
            let value = mcache.get(key);
            if (value) {
                res.send(value);
                return;
            }
            res._send = res.send;
            res.send = (body) => {
                mcache.put(key, body, seconds * 1000);
                res._send(body);
            };
            await next();
        };
    }
};