const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
router.use(function (err, req, res, next) {
    console.error(err.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err.message);
});

module.exports = router;