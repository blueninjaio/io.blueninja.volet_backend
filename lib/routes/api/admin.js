const auth = require('../auth');
const {Admin} = require('../../models');
const { BadRequestError } = require('../../errors');

module.exports = {
    getAdmins: async (req) => {
        let users = await Admin.find({});
        return {
            users: users
        };
    },
    createAdmin: async (req) => {
        let { email, password } = req.body;

        let newUser = {
            email: email,
            password: password
        };
        let admin = await Admin.findOne({ email });
        if (admin) {
            throw new BadRequestError('Email has already been registered.');
        }
        await Admin.create(newUser);
    },
    loginAdmin: async (req) => {
        let { email, password } = req.body;

        let admin = await Admin.findOne({ email });
        if (!admin || !admin.verifyPassword(password)) {
            throw new BadRequestError('Invalid login credentials.');
        }
        let token = auth.createAuthToken(admin);
        return {
            token: token,
            user: admin
        };
    },
    verifyAdmin: async (req) => {
        return {
            user: req.admin
        };
    },
    /*forgotPassword: async (req, res) => {
        let { email } = req.body;

        let user = await Admin.findOne({ email });
        if (!user) {
            throw new BadRequest('No user found with that email.');
        }
        let password = 'abcd1234';
        let hashedPassword = bcrypt.hashSync(password, 8);
        let update = {
            password: hashedPassword
        };
        await Admin.updateOne({ email }, update);
    },*/
    changeAdminPassword: async (req) => {
        let { old_password, new_password } = req.body;

        let admin = req.admin;
        if (!admin.verifyPassword(old_password)) {
            throw new BadRequestError('Invalid credentials.');
        }
        let reset = {
            password: new_password
        };
        await Admin.update({ email: admin.email }, reset);
    },
    changeAdminEmail: async (req) => {
        let { _id, email } = req.body;

        let update = {
            email
        };
        await Admin.updateOne({ _id }, update);
    }
};
