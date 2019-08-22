const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');
const Admin = require('../models/Admin');

module.exports = {
    getAll: async (req, res) => {
        let users = await Admin.find({});
        return res.ok('Admins received', {
            users: users
        });
    },
    create: async (req, res) => {
        let { email, password } = req.body;

        let newUser = {
            email: email,
            password: bcrypt.hashSync(password, 8)
        };
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.bad_request('Email has already been registered.');
        }
        await Admin.create(newUser);
        return res.ok(`Admin was successfully created`);
    },
    login: async (req, res) => {
        let { email, password } = req.body;

        let admin = await Admin.findOne({ email });
        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.bad_request('Invalid login credentials.');
        }
        let token = auth.register(admin);
        return res.ok('Successful login', {
            token: token,
            user: admin,
        });
    },
    verifyUser: async (req, res) => {
        return res.ok('User verified', {
            user: req.admin
        });
    },
    /*forgotPassword: async (req, res) => {
        let { email } = req.body;

        let user = await Admin.findOne({ email });
        if (!user) {
            return res.bad_request('No user found with that email.');
        }
        let password = 'abcd1234';
        let hashedPassword = bcrypt.hashSync(password, 8);
        let update = {
            password: hashedPassword
        };
        await Admin.updateOne({ email }, update);
        return res.ok(`Password reset to ` + password);
    },*/
    changePassword: async (req, res) => {
        let {  old_password, new_password } = req.body;

        let user = req.admin;
        if (!bcrypt.compareSync(old_password, user.password)) {
            return res.bad_request('Invalid credentials.');
        }
        let reset = {
            password: bcrypt.hashSync(new_password, 8)
        };
        await Admin.update({ email: user.email }, reset);
        return res.ok('Password has been successfully reset.');
    },
    changeEmail: async (req, res) => {
        let { _id, email } = req.body;

        let update = {
            email
        };
        await Admin.updateOne({ _id }, update);
        return res.ok('Email has been successfully changed.');
    }
};
