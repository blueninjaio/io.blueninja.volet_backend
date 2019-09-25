const { sign, verify, JsonWebTokenError, NotBeforeError, TokenExpiredError } = require('jsonwebtoken');
const { private_key, tac } = require('../config');
const { BadRequestError, UnauthorizedError } = require('../errors');

const Type = Object.freeze({
    NEW_CONTACT: 0,
    EXISTING_CONTACT: 1,
    USER_CONTACT: 2
});

function _verify(token) {
    try {
        return verify(token, private_key);
    } catch (e) {
        if (e instanceof JsonWebTokenError || e instanceof NotBeforeError) {
            throw new BadRequestError('Invalid TAC token.');
        }
        if (e instanceof TokenExpiredError) {
            throw new BadRequestError('TAC token has expired.');
        }
        throw e;
    }
}

const handler = (tac_type) => {
    return (req, res, next) => {
        let token = req.headers['x-tac-token'];
        if (!token) {
            throw new UnauthorizedError("Missing tac token header.");
        }
        let { type, contact, tac_code } = _verify(token);
        if (type !== tac_type || (req.user && contact !== req.user.contact)) {
            throw new BadRequestError('Invalid TAC token.');
        }
        req.contact = contact;
        next();
    };
};

module.exports = {
    Type,
    handler: handler,
    newTAC: handler(Type.NEW_CONTACT),
    existingTAC: handler(Type.EXISTING_CONTACT),
    userTAC: handler(Type.USER_CONTACT),

    createTacToken: (type, contact, tac_code) => {
        return sign({ type, contact, tac_code }, private_key, {
            expiresIn: tac.expiry
        });
    }
};