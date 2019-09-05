const bcrypt = require('bcryptjs');
const Merchant = require('../../models/merchant');
const auth = require('../auth');

module.exports = {
    getMerchants: async (req, res) => {
        let merchants = await Merchant.find({});
        return res.ok('Merchants received', {
            merchants: merchants
        });
    },
    registerMerchant: async (req, res) => {
        let { contact, f_name, l_name, email, password } = req.body;

        let newMerchant = {
            contact,
            f_name,
            l_name,
            email,
            password: bcrypt.hashSync(password, 8)
        };


        let merchant = await Merchant.create(newMerchant);
        return res.ok('Successfully created your account.', {
            merchant: merchant
        });
    },
    loginMerchant: async (req, res) => {
        let { email, password } = req.body;

        let merchant = await Merchant.findOne({ email });
        if (!merchant) {
            return res.unauthorized();
        }
        let passwordIsValid = bcrypt.compareSync(password, merchant.password);
        if (!passwordIsValid) {
            return res.unauthorized();
        }

        let token = auth.createAuthToken(merchant);
        return res.ok('Successful login.', {
            token: token,
            merchant: merchant
        });
    },
    createMerchantTempPassword: async (req, res) => {
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
    resetMerchantPassword: async (req, res) => {
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
    updateMerchantPushToken: async (req, res) => {
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
    removeMerchantPushToken: async (req, res) => {
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
    getMerchantById: async (req, res) => {
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