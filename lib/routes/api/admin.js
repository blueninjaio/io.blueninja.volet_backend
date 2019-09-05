const auth = require('../auth');
const Admin = require('../../models/admin');

module.exports = {
    getAdmins: async (req, res) => {
        let users = await Admin.find({});
        return res.ok('Admins received', {
            users: users
        });
    },
    createAdmin: async (req, res) => {
        let { email, password } = req.body;

        let newUser = {
            email: email,
            password: password
        };
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.bad_request('Email has already been registered.');
        }
        await Admin.create(newUser);
        return res.ok(`Admin was successfully created`);
    },
    loginAdmin: async (req, res) => {
        let { email, password } = req.body;

        let admin = await Admin.findOne({ email });
        if (!admin || !admin.verifyPassword(password)) {
            return res.bad_request('Invalid login credentials.');
        }
        let token = auth.createAuthToken(admin);
        return res.ok('Successful login', {
            token: token,
            user: admin,
        });
    },
    verifyAdmin: async (req, res) => {
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
    changeAdminPassword: async (req, res) => {
        let {  old_password, new_password } = req.body;

        let admin = req.admin;
        if (!admin.verifyPassword(old_password)) {
            return res.bad_request('Invalid credentials.');
        }
        let reset = {
            password: new_password
        };
        await Admin.update({ email: user.email }, reset);
        return res.ok('Password has been successfully reset.');
    },
    changeAdminEmail: async (req, res) => {
        let { _id, email } = req.body;

        let update = {
            email
        };
        await Admin.updateOne({ _id }, update);
        return res.ok('Email has been successfully changed.');
    }
};
