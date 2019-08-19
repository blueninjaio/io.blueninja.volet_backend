const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

module.exports = {
    getAll: async (req, res) => {
        let users = await User.find({});
        return res.ok('Users received', {
            users: users
        });
    },
    register: async (req, res) => {
        let { contact, facebook_id, google_id, f_name, l_name, email, password } = req.body;

        let newUser = {
            contact,
            facebook_id,
            google_id,
            f_name,
            l_name,
            email,
            password: bcrypt.hashSync(password, 8),
            credits: 0
        };

        let user = await User.create(newUser);
        return res.ok('Successfully created your account.', {
            user: user
        });
    },
    login: async (req, res) => {
        let { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return req.unauthorized("Invalid login credentials.");
        }
        let token = jwt.sign({ email, type: 'user' }, config.private_key, {
            expiresIn: 43200
        });
        return res.ok('Successful login.', {
            token: token,
            user: user
        });
    },
    createTempPassword: async (req, res) => {
        let { email } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return req.unauthorized("User not found.");
        }
        let newPassword = 'abcd1234';
        let hashedPassword = bcrypt.hashSync(newPassword, 8);

        let update = {
            password: hashedPassword
        };

        await User.updateOne({ email }, update);
        return res.ok(`Password reset to ` + newPassword);
    },
    resetPassword: async (req, res) => {
        let { temp_password, new_password } = req.body;
        let user = req.user;
        let passwordIsValid = bcrypt.compareSync(temp_password, user.password);
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
            return req.unauthorized("User not found.");
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
            return req.unauthorized("User not found.");
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
            return req.unauthorized("User not found.");
        }
        return res.ok('Succesfully received user information', {
            user: user
        });
    },
    verify: async (req, res) => {
        return res.ok('User successfully verified', {
            user: req.user
        });
    }
};