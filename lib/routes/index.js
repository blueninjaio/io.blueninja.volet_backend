const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
router.use(function (err, req, res, next) {
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