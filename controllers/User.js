const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

module.exports = {
    getAll: (req, res) => {
        User.find({}, (err, users) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    users,
                    message: "Success: Users received"
                });
            }
        });
    },
    register: (req, res) => {
        let {
            contact,
            facebook_id,
            google_id,
            f_name,
            l_name,
            email,
            password,
        } = req.body;

        let newUser = {
            contact,
            facebook_id,
            google_id,
            f_name,
            l_name,
            email
        };
        newUser.password = bcrypt.hashSync(password, 8);

        User.create(newUser, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was an error adding you. Please try again in a bit."
                });
            } else {
                return res.status(200).send({
                    success: true,
                    user: user,
                    message: "Success: Successfully created your account."
                });
            }
        });
    },
    login: (req, res) => {
        let { email, password } = req.body;

        User.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was a server error, please try again in a bit."
                });
            } else {
                let passwordIsValid = bcrypt.compareSync(password, user.password);
                if (!passwordIsValid) {
                    return res.status(401).send({
                        success: false,
                        message: "Error: Credentials are invalid."
                    });
                }

                let token = jwt.sign({ email }, config.secret, {
                    expiresIn: 43200
                });
                return res.status(200).send({
                    success: true,
                    token: token,
                    user: user,
                    message: "Success: Successful login."
                });
            }
        });
    },
    createTempPassword: (req, res) => {
        let { email } = req.body;

        User.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was a server error, please try again in a bit."
                });
            } else {
                let uniqueKey = 'abcd1234';
                let password = uniqueKey;
                let hashedPassword = bcrypt.hashSync(password, 8);

                let update = {};
                update.password = hashedPassword;

                User.updateOne({ email }, update, (err, updatedUser) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    } else {
                        return res.status(200).send({
                            success: true,
                            message: `Success: Password reset to abcd1234`
                        });
                    }
                });
            }
        });
    },
    resetPassword: (req, res) => {
        let { email, temp_password, new_password } = req.body;

        User.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was a server error, please try again in a bit."
                });
            } else {
                var passwordIsValid = bcrypt.compareSync(temp_password, user.password);
                if (!passwordIsValid) {
                    return res.status(401).send({
                        success: false,
                        message: "Error: Credentials are invalid."
                    });
                } else {
                    let hashedPassword = bcrypt.hashSync(new_password, 8);

                    let reset = {
                        tempPassword: false,
                        password: hashedPassword
                    };

                    User.update({ email }, reset, (err, user) => {
                        if (err) {
                            return res.status(500).send({
                                success: false,
                                message: 'Error: Server error'
                            });
                        } else {
                            return res.status(200).send({
                                success: true,
                                message: 'Success: Password has been successfully reset.'
                            });
                        }
                    });
                }
            }
        });
    },
    updatePushToken: (req, res) => {
        let {
            email,
            token
        } = req.body;

        User.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was an error finding the user with that email"
                });
            } else {
                let update = {};
                update.push_token = token;

                User.updateOne({ email }, update, (err, user) => {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    }

                    return res.status(200).send({
                        success: true,
                        message: "Success: User Push Token Successfully Updated."
                    });
                });
            }
        });
    },
    removePushToken: (req, res) => {
        let { email } = req.body;

        User.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                let update = {};
                update.push_token = '';

                User.updateOne({ email }, update, (err, user) => {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    }

                    return res.status(200).send({
                        success: true,
                        message: "Success: User Push Token Successfully Removed"
                    });
                });
            }
        });
    },
    getById: (req, res) => {
        let { _id } = req.body;

        User.findOne({ _id }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    user,
                    message: "Success: Succesfully received user information"
                });
            }
        });
    },
    verify: (req, res) => {
        let { email } = req.body;

        User.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            }

            return res.status(200).send({
                success: true,
                user: user,
                message: "Success: User successfully verified"
            });
        });
    }
};