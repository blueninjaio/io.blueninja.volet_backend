const Voucher = require('../models/Voucher');
const Volet = require('../models/Volet');

module.exports = {
    getAll: (req, res) => {
        Voucher.find({}, (err, vouchers) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    vouchers,
                    message: "Success: Vouchers received"
                });
            }
        });
    },
    create: (req, res) => {
        let {
            name,
            description,
            amount,
            quantity,
            expiry,
        } = req.body;


        let newVoucher = {
            name,
            description,
            amount,
            quantity,
            expiry: new Date(expiry)
        };

        Voucher.create(newVoucher, (err, voucher) => {
            if (err) {
                return res.status(404).send({
                    success: false,
                    message: "Error: There was an error creating the voucher."
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Success: Successfully created the voucher."
                });
            }
        });
    },
    redeem: (req, res) => {
        let {
            name,
            user,
            user_id,
        } = req.body;

        Voucher.findOne({ name }, (err, voucher) => {
            if (err) {
                return res.status(404).send({
                    success: false,
                    message: "Error: There was an error matching the voucher."
                });
            } else {
                let amount = voucher.amount;

                if (voucher.usage.includes(user)) {
                    return res.status(404).send({
                        success: false,
                        message: 'Error: You have already redeemed this ticket.'
                    });
                } else {
                    let newVolet = {
                        persona_id: user_id,
                        persona_model: "User",
                        amount
                    };

                    Volet.create(newVolet, (err, volet) => {
                        if (err) {
                            return res.status(404).send({
                                success: false,
                                message: "Error: There was an error creating the volet."
                            });
                        } else {
                            let newUsage = {
                                user,
                                date: Date.now()
                            };

                            newUsages = voucher.usage;
                            newUsages.push(newUsage);
                            newQuantity = voucher.quantity - 1;

                            let update = {
                                usage: newUsages,
                                quantity: newQuantity
                            };

                            Voucher.updateOne({}, update, (err, voucer) => {
                                if (err) {
                                    return res.status(404).send({
                                        success: false,
                                        message: "Error: There was an error matching the voucher."
                                    });
                                } else {
                                    return res.status(200).send({
                                        success: true,
                                        message: "Success: Successfully redeemed Voucher."
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
};
