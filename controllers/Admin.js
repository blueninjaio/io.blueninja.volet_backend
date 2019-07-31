const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config/config');

module.exports = {
    getAll: (req, res) => {
        Admin.find({}, (err, users) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            }
            return res.status(200).send({
                success: true,
                users: users,
                message: "Success: Admins received"
            });
        });
    },
    create: (req, res) => {
        let {
            email,
            password
        } = req.body;
        let newUser = {
            email: email,
            password: bcrypt.hashSync(password, 8)
        };
        Admin.create(newUser, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Erro: There was a problem adding the Admin"
                });
            }
            return res.status(200).send({
                success: true,
                message: `Success: Admin was successfully created`
            });
        });
    },
    login: (req, res) => {
        let { email, password } = req.body;

        Admin.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server Error"
                });
            }
            if (!user) {
                return res.status(500).send({
                    success: false,
                    message: "Error: User not found."
                });
            }
            let passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send({
                    success: false,
                    message: "Error: Wrong Password Entered"
                });
            }
            let token = jwt.sign({ email }, config.secret, {
                expiresIn: 43200
            });
            return res.status(200).send({
                success: true,
                token: token,
                user,
                message: "Success: Successful login"
            });
        });
    },
    verifyUser: (req, res) => {
        let { email } = req.body;
        Admin.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            }
            return res.status(200).send({
                success: true,
                user: user,
                message: "Success: User verified"
            });
        });
    },
    forgotPassword: (req, res) => {
        let { email } = req.body;

        Admin.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was a server error, please try again in a bit."
                });
            } else {
                let password = 'abcd1234';
                let hashedPassword = bcrypt.hashSync(password, 8);

                let update = {};
                update.password = hashedPassword;

                Admin.updateOne({ email }, update, (err, updatedUser) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    }
                    return res.status(200).send({
                        success: true,
                        message: `Success: Password reset to abcd1234`
                    });
                });
            }
        });
    },
    changePassword: (req, res) => {
        let {
            email,
            old_password,
            new_password
        } = req.body;

        Admin.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was a server error, please try again in a bit."
                });
            }
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "Error: Credentials are invalid."
                });
            }
            var passwordIsValid = bcrypt.compareSync(old_password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send({
                    success: false,
                    message: "Error: Credentials are invalid."
                });
            } else {
                let reset = {
                    password: bcrypt.hashSync(new_password, 8)
                };

                Admin.update({ email }, reset, (err, user) => {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    }
                    return res.status(200).send({
                        success: true,
                        message: 'Success: Password has been successfully reset.'
                    });
                });
            }
        });
    },
    changeEmail: (req, res) => {
        let { _id, email } = req.body;
        let update = {
            email
        };

        Admin.updateOne({ _id }, update, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was a server error, please try again in a bit."
                });
            }
            return res.status(200).send({
                success: true,
                message: 'Success: Email has been successfully changed.'
            });
        });
    }
};
