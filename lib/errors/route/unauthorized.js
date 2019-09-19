const RouteError = require("./route-error");

class Unauthorized extends RouteError {
    constructor(message) {
        super(401, message);
        this.name = "Unauthorized";
    }
}

module.exports = Unauthorized;