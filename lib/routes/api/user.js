const { User, Bank, BankAccount } = require('../../models');
const auth = require('../auth');

module.exports = {
    getUsers: async (req, res) => {
        let users = await User.find({});
        return res.ok('Users received', {
            users: users
        });
    },
    registerUser: async (req, res) => {
        let { facebook_id, google_id, f_name, l_name, email, password } = req.body;
        let contact = req.contact;
        let existingUser = await User.findOne({ $or: [{ email }, { contact }] });
        if (existingUser) {
            return res.badRequest(email === existingUser.email
                ? "User already exists with that email."
                : "User already exists with that phone number."
            );
        }
        let user = await User.create({
            contact,
            facebook_id,
            google_id,
            f_name,
            l_name,
            email,
            password
        });
        return res.ok('Successfully created your account.', {
            user
        });
    },
    loginUser: async (req, res) => {
        let { login_input, password, push_token } = req.body;
        let user = await User.findOne({ $or: [{ email: login_input }, { contact: login_input }] });
        if (!user || !user.verifyPassword(password)) {
            return res.unauthorized("Invalid login credentials.");
        }
        if (push_token && push_token !== user.push_token) {
            user.push_token = push_token;
            await user.save();
        }
        let token = auth.createAuthToken(user);
        return res.ok('Successful login.', {
            token,
            user
        });
    },
    forgetUserPassword: async (req, res) => {
        let contact = req.contact;
        let user = await User.findOne({ contact });
        if (!user) {
            return res.badRequest("User not found.");
        }
        user.password = 'abcd1234';
        await user.save();
        return res.ok(`Password reset.`, {
            email: user.email
        });
    },
    resetUserPassword: async (req, res) => {
        let { old_password, new_password } = req.body;
        let user = req.user;
        if (!user.verifyPassword(old_password)) {
            return res.unauthorized('User password does not match.');
        }
        user.password = new_password;
        await user.save();
        return res.ok('Password has been successfully reset.');
    },
    getUserById: async (req, res) => {
        let { id } = req.params;
        let user = await User.findOne({ _id: id });
        if (!user) {
            return res.badRequest("User not found.");
        }
        return res.ok('Successfully received user information', {
            user
        });
    },
    getUserInfo: async (req, res) => {
        return res.ok('User successfully retrieved', {
            user: req.user
        });
    },
    editSavingsPlan: async (req, res) => {
        let { active, amount } = req.body;
        let user = req.user;
        user.savings_active = active;
        user.monthly_savings = amount;
        await user.save();
        return res.ok('Savings plan successfully updated.');
    },
    getUsersByMobile: async (req, res) => {
        let { contacts } = req.body;
        let users = await User.find({ 'contact': { $in: contacts } }).select('contact f_name l_name photo_url');
        return res.ok('Successfully received users information', {
            users
        });
    },
    editUserInfo: async (req, res) => {
        let { f_name, l_name, email, address } = req.body;
        let image = req.file;
        let user = req.user;
        user.f_name = f_name;
        user.l_name = l_name;
        user.email = email;
        user.address = address;
        user.photo_url = image.filename;
        user.save();
        return res.ok('Edited user info.', {
            user
        });
    },
    addBank: async (req, res) => {
        let { name, number, bank } = req.body;
        let bankModel = await Bank.findOne({ name: bank });
        if (!bankModel) {
            return res.badRequest("Bank not found.");
        }
        let bankAccount = await BankAccount.create({
            name,
            number,
            bank: bankModel._id
        });
        req.user.bank_accounts.push(bankAccount._id);
        req.user.save();
        return res.ok('Bank successfully added.');
    },
    getUserAgents: async (req, res) => {
        let users = await User.find({ is_agent: true, is_visible: true }).select('contact f_name l_name photo_url');
        return res.ok('User Agents received', {
            users: users
        });
    },
    applyAgent: async (req, res) => {
        let user = req.user;
        if (user.is_agent) {
            return res.badRequest("You are already a user agent.");
        }
        if (user.agent_applied) {
            return res.badRequest("You already have a pending application.");
        }
        user.agent_applied = true;
        user.save();
        return res.ok('Agent Proposal successfully created.');
    },
    toggleAgent: async (req, res) => {
        let user = req.user;
        if (user.is_agent) {
            return res.badRequest("You are already a user agent.");
        }
        user.is_visible = !user.is_visible;
        user.save();
    }
};