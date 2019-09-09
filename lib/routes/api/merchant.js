const {Merchant}  = require('../../models');
const auth = require('../auth');

module.exports = {
    getMerchants: async (req, res) => {
        let merchants = await Merchant.find({});
        return res.ok('Merchants received', {
            merchants: merchants
        });
    },
    registerMerchant: async (req, res) => {
        let { f_name, l_name, email, password } = req.body;
        let contact = req.contact;
        let existingUser = await Merchant.findOne({ $or: [{ email }, { contact }] });
        if (existingUser) {
            return res.badRequest(email === existingUser.email
                ? "Merchant already exists with that email."
                : "Merchant already exists with that phone number."
            );
        }
        let merchant = await Merchant.create({
            contact,
            f_name,
            l_name,
            email,
            password
        });
        return res.ok('Successfully created your account.', {
            merchant
        });
    },
    loginMerchant: async (req, res) => {
        let { login_input, password, push_token } = req.body;
        let merchant = await Merchant.findOne({ $or: [{ email: login_input }, { contact: login_input }] });
        if (!merchant || !merchant.verifyPassword(password)) {
            return res.unauthorized("Invalid login credentials.");
        }
        if (push_token && push_token !== merchant.push_token) {
            merchant.push_token = push_token;
            await merchant.save();
        }
        let token = auth.createAuthToken(merchant);
        return res.ok('Successful login.', {
            token,
            merchant
        });
    },
    forgetMerchantPassword: async (req, res) => {
        let { email } = req.body;

        let merchant = await Merchant.findOne({ email });
        if (!merchant) {
            return res.badRequest('Merchant not found.');
        }
        merchant.password = 'abcd1234';
        await merchant.save();
        return res.ok(`Password reset to abcd1234`);
    },
    resetMerchantPassword: async (req, res) => {
        let { old_password, new_password } = req.body;
        let merchant = req.merchant;
        if (!merchant.verifyPassword(old_password)) {
            return res.unauthorized('User password does not match.');
        }
        merchant.password = new_password;
        await merchant.save();
        return res.ok('Password has been successfully reset.');
    },
    getMerchantById: async (req, res) => {
        let { id } = req.params;
        let merchant = await Merchant.findOne({ _id: id });
        if (!merchant) {
            return res.badRequest('Merchant not found.');
        }
        return res.ok('Successfully received merchant information', {
            merchant
        });
    },
    getMerchantInfo: async (req, res) => {
        return res.ok('Merchant successfully retrieved', {
            merchant: req.merchant
        });
    },
    editMerchantInfo: async (req, res) => {
        let { f_name, l_name, email, address } = req.body;
        let image = req.file;
        let merchant = req.merchant;
        merchant.f_name = f_name;
        merchant.l_name = l_name;
        merchant.email = email;
        merchant.address = address;
        merchant.photo_url = image.filename;
        merchant.save();
        return res.ok('Edited merchant info.', {
            merchant
        });
    },
};