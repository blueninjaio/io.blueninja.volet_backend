const mcache = require("memory-cache");

module.exports = (seconds) => {
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
        next();
    };
};