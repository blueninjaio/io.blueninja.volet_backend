const { User, Bank, BankAccount, PaymentReason, UserPayment } = require('../../models');
const auth = require('../auth');

async function checkPayment(from, to, reason) {
    if (to === from) {
        return "You cannot send a payment to yourself.";
    }
    let toUser = await User.findOne({_id: to });
    if (!toUser) {
        return "Cannot find user to send to.";
    }
    let paymentReason = await PaymentReason.findOne({ name: reason });
    if (!paymentReason) {
        return "Could not find payment reason.";
    }
    return paymentReason._id;
}

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
            return res.bad_request(email === existingUser.email
                ? "User already exists with that email."
                : "User already exists with that phone number."
            );
        }
        let newUser = {
            contact,
            facebook_id,
            google_id,
            f_name,
            l_name,
            email,
            password
        };
        let user = await User.create(newUser);
        return res.ok('Successfully created your account.', {
            user
        });
    },
    loginUser: async (req, res) => {
        let { login_input, password } = req.body;
        let user = await User.findOne({ $or: [{ email: login_input }, { contact: login_input }] });
        if (!user || !user.verifyPassword(password)) {
            return res.unauthorized("Invalid login credentials.");
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
            return res.bad_request("User not found.");
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
    updateUserPushToken: async (req, res) => {
        let { email, token } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.bad_request("User not found.");
        }
        user.push_token = token;
        await user.save();
        return res.ok('User Push Token Successfully Updated.');
    },
    removeUserPushToken: async (req, res) => {
        let { email } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.bad_request("User not found.");
        }
        user.push_token = undefined;
        await user.save();
        return res.ok('User Push Token Successfully Removed');
    },
    getUserById: async (req, res) => {
        let { id } = req.params;
        let user = await User.findOne({ _id: id });
        if (!user) {
            return res.bad_request("User not found.");
        }
        return res.ok('Successfully received user information', {
            user
        });
    },
    verifyUser: async (req, res) => {
        return res.ok('User successfully retrieved', {
            user: req.user
        });
    },
    toggleSavingsPlan: async (req, res) => {
        return res.ok('User successfully verified', {
            user: req.user
        });
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
            return res.bad_request("Bank not found.");
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
    sendVoletPayment: async (req, res) => {
        let { to, amount, reason, description } = req.body;
        let user = req.user;
        let from = user._id.toString();
        reason = await checkPayment(from, to, reason);
        if (typeof reason === 'string') {
            return res.bad_request(reason);
        }
        if (amount > user.credits) {
            return res.bad_request("Insufficient funds in volet.");
        }
        let toUser = await User.findOne({_id: to });
        user.credits -= amount;
        await user.save();
        toUser.credits += amount;
        await toUser.save();
        await UserPayment.create({
            from,
            to,
            amount,
            reason,
            description,
            pending: false
        });
        return res.ok('Successfully transferred.');
    },
    requestPayment: async (req, res) => {
        let { payments } = req.body;
        let user = req.user;
        let to = user._id.toString();
        for (let i = 0; i < payments.length; i++) {
            let { from, reason } = payments[i];
            reason = await checkPayment(from, to, reason);
            if (typeof reason === 'string') {
                return res.bad_request(reason);
            }
            payments[i].reason = reason;
        }
        let queries = [];
        for (let i = 0; i < payments.length; i++) {
            let payment = payments[i];
            let { from, amount, reason, description } = payment;
            queries.push(UserPayment.create({
                from,
                to,
                amount,
                reason,
                description,
                pending: true
            }));
        }
        await Promise.all(queries);
        return res.ok('Successfully requested.');
    },
    getPayments:  async (req, res) => {
        let user = req.user;
        let payments = await UserPayment.find({ $or: [{ from: user._id }, { to: user._id }] }).populate('from').populate('to').populate('reason');
        return res.ok('Successfully requested.', {
            payments
        });
    },
    applyAgent: async (req, res) => {
        let user = req.user;
        if (user.is_agent) {
            return res.bad_request("You are already a user agent.");
        }
        if (user.agent_applied) {
            return res.bad_request("You already have a pending application.");
        }
        user.agent_applied = true;
        user.save();
        return res.ok('Agent Proposal successfully created.');
    },
};