const { sign, verify, JsonWebTokenError, NotBeforeError, TokenExpiredError } = require('jsonwebtoken');
const { private_key, tac } = require('../config');
const { BadRequestError, UnauthorizedError } = require('../errors');

const Type = Object.freeze({
    NEW_CONTACT: 0,
    EXISTING_CONTACT: 1,
    USER_CONTACT: 2
});
const handler = (tac_type) => {
    return async (req, res, next) => {
        try {
            let token = req.headers['x-tac-token'];
            if (!token) {
                throw new UnauthorizedError("Missing tac token header.");
            }
            let { type, contact, tac_code } = verify(token, private_key);
            if (type !== tac_type || (req.user && contact !== req.user.contact)) {
                throw new BadRequestError('Invalid TAC token.');
            }
            req.contact = contact;
            next();
        } catch (e) {
            if (e instanceof JsonWebTokenError || e instanceof NotBeforeError) {
                next(new BadRequestError('Invalid TAC token.'));
            }
            if (e instanceof TokenExpiredError) {
                next(new BadRequestError('TAC token has expired.'));
            }
            next(e);
        }
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