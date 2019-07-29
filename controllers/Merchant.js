const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Merchant = require('../models/Merchant');
const config = require('../config/config');

module.exports = {
    getAll: (req, res) => {
        Merchant.find({}, (err, merchants) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    merchants,
                    message: "Success: Merchants received"
                })
            }
        })
    },
    register: (req, res) => {
        let {
            contact,
            f_name,
            l_name,
            email,
            password,
        } = req.body;

        let newMerchant = {
            contact,
            f_name,
            l_name,
            email
        };

        let hashedPassword = bcrypt.hashSync(password, 8);
        newMerchant.password = hashedPassword;


        Merchant.create(newMerchant, (err, merchant) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was an error adding you. Please try again in a bit."
                });
            } else {
                return res.status(200).send({
                    success: true,
                    merchant,
                    message: "Success: Successfully created your account."
                })
            }
        })
    },
    login: (req, res) => {
        let { email, password } = req.body;

        Merchant.findOne({ email }, (err, merchant) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was a server error, please try again in a bit."
                });
            } else {
                var passwordIsValid = bcrypt.compareSync(password, merchant.password);
                if (!passwordIsValid) {
                    return res.status(401).send({
                        success: false,
                        message: "Error: Credentials are invalid."
                    });
                }

                var token = jwt.sign({ email }, config.secret, {
                    expiresIn: 43200
                });

                return res.status(200).send({
                    success: true,
                    token: token,
                    merchant,
                    message: "Success: Successful login."
                })
            }
        })
    },
    createTempPassword: (req, res) => {
        let { email } = req.body;

        Merchant.findOne({ email }, (err, merchant) => {
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

                Merchant.updateOne({ email }, update, (err, updatedMerchant) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    } else {
                        return res.status(200).send({
                            success: true,
                            message: `Success: Password reset to abcd1234`
                        })
                    }
                })
            }
        })
    },
    resetPassword: (req, res) => {
        let { email, temp_password, new_password } = req.body;

        Merchant.findOne({ email }, (err, merchant) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was a server error, please try again in a bit."
                });
            } else {
                var passwordIsValid = bcrypt.compareSync(temp_password, merchant.password);
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

                    Merchant.update({ email }, reset, (err, merchant) => {
                        if (err) {
                            return res.status(500).send({
                                success: false,
                                message: 'Error: Server error'
                            });
                        } else {
                            return res.status(200).send({
                                success: true,
                                message: 'Success: Password has been successfully reset.'
                            })
                        }
                    })
                }
            }
        })
    },
    updatePushToken: (req, res) => {
        let { email, token } = req.body;

        Merchant.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: There was an error finding the user with that email"
                });
            } else {
                let update = {};
                update.push_token = token;

                Merchant.updateOne({ email }, update, (err, user) => {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    }

                    return res.status(200).send({
                        success: true,
                        message: "Success: User Push Token Successfully Updated."
                    })
                })
            }
        })
    },
    removePushToken: (req, res) => {
        let { email } = req.body;

        Merchant.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                let update = {};
                update.push_token = '';

                Merchant.updateOne({ email }, update, (err, user) => {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    }

                    return res.status(200).send({
                        success: true,
                        message: "Success: User Push Token Successfully Removed"
                    })
                })
            }
        })
    },
    getById: (req, res) => {
        let { _id } = req.body;

        Merchant.findOne({ _id }, (err, merchant) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    merchant,
                    message: "Success: Succesfully received user information"
                })
            }
        })
    }
};