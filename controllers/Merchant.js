const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Merchant = require('../models/Merchant');
const config = require('../config/config');

module.exports = {
    getAll: async (req, res) => {
        let merchants = await Merchant.find({});
        return res.ok('Merchants received', {
            merchants: merchants
        });
    },
    register: async (req, res) => {
        let { contact, f_name, l_name, email, password } = req.body;

        let newMerchant = {
            contact,
            f_name,
            l_name,
            email,
            dateCreated: new Date(),
            password: bcrypt.hashSync(password, 8)
        };


        let merchant = await Merchant.create(newMerchant);
        return res.ok('Successfully created your account.', {
            merchant: merchant
        });
    },
    login: async (req, res) => {
        let { email, password } = req.body;

        let merchant = await Merchant.findOne({ email });
        if (!merchant) {
            return res.unauthorized();
        }
        let passwordIsValid = bcrypt.compareSync(password, merchant.password);
        if (!passwordIsValid) {
            return res.unauthorized();
        }

        let token = jwt.sign({ email, type: 'merchant' }, config.private_key, {
            expiresIn: 43200
        });

        return res.ok('Successful login.', {
            token: token,
            merchant: merchant
        });
    },
    createTempPassword: async (req, res) => {
        let { email } = req.body;

        let merchant = await Merchant.findOne({ email });
        if (!merchant) {
            return res.bad_request('Merchant not found.');
        }
        let uniqueKey = 'abcd1234';
        let password = uniqueKey;
        let hashedPassword = bcrypt.hashSync(password, 8);

        let update = {};
        update.password = hashedPassword;

        await Merchant.updateOne({ email }, update);
        return res.ok(`Password reset to abcd1234`);
    },
    resetPassword: async (req, res) => {
        let { email, temp_password, new_password } = req.body;

        let merchant = await Merchant.findOne({ email });
        if (!merchant) {
            return res.bad_request('Merchant not found.');
        }
        let passwordIsValid = bcrypt.compareSync(temp_password, merchant.password);
        if (!passwordIsValid) {
            return res.unauthorized('Credentials are invalid.');
        }
        let hashedPassword = bcrypt.hashSync(new_password, 8);

        let reset = {
            tempPassword: false,
            password: hashedPassword
        };

        await Merchant.update({ email }, reset);
        return res.ok('Password has been successfully reset.');
    },
    updatePushToken: async (req, res) => {
        let { email, token } = req.body;

        let merchant = await Merchant.findOne({ email });
        if (!merchant) {
            return res.bad_request('Merchant not found.');
        }
        let update = {
            push_token: token
        };
        await Merchant.updateOne({ email }, update);
        return res.ok('User Push Token Successfully Updated.');
    },
    removePushToken: async (req, res) => {
        let { email } = req.body;
        let merchant = await Merchant.findOne({ email });
        if (!merchant) {
            return res.bad_request('Merchant not found.');
        }
        let update = {
            push_token: ''
        };

        await Merchant.updateOne({ email }, update);
        return res.ok('User Push Token Successfully Removed');
    },
    getById: async (req, res) => {
        let { _id } = req.body;

        let merchant = await Merchant.findOne({ _id });
        if (!merchant) {
            return res.bad_request('Merchant not found.');
        }
        return res.ok('Succesfully received user information', {
            merchant: merchant
        });
    }
};