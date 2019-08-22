const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Merchant = require('../models/Merchant');
const User = require('../models/User');
const { private_key } = require('../config/config');

module.exports = {
    async authenticate(req, res, types) {
        try {
            let token = req.headers['authorization'];
            if (!token) {
                return 'No token provided.';
            }
            let decoded = this.decodeToken(token.substr('Bearer '.length));
            if (!types.includes(decoded.type)) {
                return 'Failed to authenticate token.';
            }
            let _id = decoded._id;
            switch (decoded.type) {
                case 'admin': {
                    req.admin = await Admin.findOne({ _id });
                    break;
                }
                case 'merchant': {
                    req.merchant = await Merchant.findOne({ _id });
                    break;
                }
                case 'user': {
                    req.user = await User.findOne({ _id });
                    break;
                }
            }
            return false;
        } catch (e) {
            return e.message;
        }
    },

    register(user) {
        let type;
        if (user instanceof User) {
            type = 'user';
        } else if (user instanceof Merchant) {
            type = 'merchant';
        } else if (user instanceof Admin) {
            type = 'admin';
        }
        return this.createToken({ _id: user._id, type });
    },

    createToken(object, expiry) {
        return jwt.sign(object, private_key, {
            expiresIn: expiry || 43200
        });
    },

    decodeToken(token) {
        return jwt.verify(token, private_key);
    }
};