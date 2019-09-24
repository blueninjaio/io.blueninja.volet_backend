const auth = require('../auth');
const Admin = require('../../models/admin');

module.exports = {
  getAdmins: async (req, res) => {
    const users = await Admin.find({});
    return res.ok('Admins received', {
      users: users
    });
  },
  createAdmin: async (req, res) => {
    const { email, password } = req.body;

    const newUser = {
      email: email,
      password: password
    };
    const admin = await Admin.findOne({ email });
    if (admin) {
      return res.badRequest('Email has already been registered.');
    }
    await Admin.create(newUser);
    return res.ok('Admin was successfully created');
  },
  loginAdmin: async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !admin.verifyPassword(password)) {
      return res.badRequest('Invalid login credentials.');
    }
    const token = auth.createAuthToken(admin);
    return res.ok('Successful login', {
      token: token,
      user: admin
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
            return res.badRequest('No user found with that email.');
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
    const { old_password, new_password } = req.body;

    const admin = req.admin;
    if (!admin.verifyPassword(old_password)) return res.badRequest('Invalid credentials.');

    const reset = {
      password: new_password
    };
    await Admin.update({ email: admin.email }, reset);
    return res.ok('Password has been successfully reset.');
  },
  changeAdminEmail: async (req, res) => {
    const { _id, email } = req.body;

    const update = {
      email
    };
    await Admin.updateOne({ _id }, update);
    return res.ok('Email has been successfully changed.');
  }
};
