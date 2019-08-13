const Response = require('./Response');

module.exports = handler => {
    return (req, res) => {
        res = new Response(res);
        try {
            handler(req, res);
        } catch (e) {
            return res.internal_server_error();
        }
    }
};