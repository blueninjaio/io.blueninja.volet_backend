const RouteError = require("./route-error");

class Conflict extends RouteError {
    constructor(message) {
        super(409, message);
        this.name = "Conflict";
    }
}

module.exports = Conflict;