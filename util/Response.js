const HttpStatus = require('http-status-codes');

class Response {
    constructor(res) {
        this.res = res;
    }

    response(code, message, object) {
        let newObject = {};
        if (object !== undefined) {
            for (let k in object) {
                newObject[k] = object[k];
            }
        }
        newObject.message = message;
        newObject.success = code === HttpStatus.OK;
        return this.res.status(code).send(newObject);
    };

    internal_server_error(message) {
        return this.response(HttpStatus.INTERNAL_SERVER_ERROR, message || "Server Error");
    };

    ok(message, object) {
        return this.response(HttpStatus.OK, message, object);
    };

    conflict(message) {
        return this.response(HttpStatus.CONFLICT, message || "Error 409: Conflict");
    };

    bad_request(message) {
        return this.response(HttpStatus.BAD_REQUEST, message || "Error 400: Bad Request");
    };

    unauthorized(message) {
        return this.response(HttpStatus.UNAUTHORIZED, message || "Error 401: Unauthorized");
    };
}

module.exports = Response;