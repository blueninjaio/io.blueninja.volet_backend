const Response = require('./Response');

module.exports = handler => {
    return async (req, res) => {
        res = new Response(res);
        try {
            await handler(req, res);
        } catch (e) {
            return res.internal_server_error();
        }
    }
};