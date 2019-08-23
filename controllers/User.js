const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middlewares/auth');

module.exports = {
    getAll: async (req, res) => {
        let users = await User.find({});
        return res.ok('Users received', {
            users: users
        });
    },
    register: async (req, res) => {
        let { facebook_id, google_id, f_name, l_name, email, password } = req.body;
        let contact = req.contact;
        let user = await User.findOne({ $or: [{ email }, { contact }] });
        if (user) {
            return res.bad_request("User already exists with that email or phone number.");
        }
        let newUser = {
            contact,
            facebook_id,
            google_id,
            f_name,
            l_name,
            email,
            password: bcrypt.hashSync(password, 8)
        };
        user = await User.create(newUser);
        return res.ok('Successfully created your account.', {
            user: user
        });
    },
    login: async (req, res) => {
        let { login_input, password } = req.body;
        let user = await User.findOne({ $or: [{ email: login_input }, { contact: login_input }] });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.unauthorized("Invalid login credentials.");
        }
        let token = auth.register(user);
        return res.ok('Successful login.', {
            token: token,
            user: user
        });
    },
    forgetPassword: async (req, res) => {
        let contact = req.contact;
        let user = await User.findOne({ contact });
        if (!user) {
            return res.unauthorized("User not found.");
        }
        let newPassword = 'abcd1234';
        let hashedPassword = bcrypt.hashSync(newPassword, 8);

        let update = {
            password: hashedPassword
        };

        await User.updateOne({ _id: user._id }, update);
        return res.ok(`Password reset.`, {
            email: user.email
        });
    },
    resetPassword: async (req, res) => {
        let { old_password, new_password } = req.body;
        let user = req.user;
        let passwordIsValid = bcrypt.compareSync(old_password, user.password);
        if (!passwordIsValid) {
            return res.unauthorized('User password does not match.');
        }
        let reset = {
            tempPassword: false,
            password: bcrypt.hashSync(new_password, 8)
        };
        await User.update({ _id: user._id }, reset);
        return res.ok('Password has been successfully reset.');
    },
    updatePushToken: async (req, res) => {
        let { email, token } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.unauthorized("User not found.");
        }
        let update = {
            push_token: token
        };

        await User.updateOne({ email }, update);
        return res.ok('User Push Token Successfully Updated.');
    },
    removePushToken: async (req, res) => {
        let { email, token } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.unauthorized("User not found.");
        }
        let update = {
            push_token: token
        };
        await User.updateOne({ email }, update);

        return res.ok('User Push Token Successfully Removed');
    },
    getById: async (req, res) => {
        let { _id } = req.body;

        let user = await User.findOne({ _id });
        if (!user) {
            return res.unauthorized("User not found.");
        }
        return res.ok('Succesfully received user information', {
            user: user
        });
    },
    verify: async (req, res) => {
        throw new Error("Error 2")
        return res.ok('User successfully verified', {
            user: req.user
        });
    },
    toggleSavingsPlan: async (req, res) => {
        return res.ok('User successfully verified', {
            user: req.user
        });
    },
    getByMobile: async (req, res) => {
        let { contact } = req.body;

        let user = await User.findOne({ contact });
        if (!user) {
            return res.bad_request("User not found.");
        }
        return res.ok('Succesfully received user information', {
            f_name: user.f_name,
            l_name: user.l_name,
            photo_url: user.photo_url
        });
    },
    editUserInfo: async (req, res) => {
        let { image, f_name, l_name, email, address } = req.body;

        let user = await User.findOne({ contact });
        if (!user) {
            return res.bad_request("User not found.");
        }
        return res.ok('Edited user info.');
    }
};