const Voucher = require('../../models/voucher');

module.exports = {
    getVouchers: async (req, res) => {
        let vouchers = await Voucher.find({});
        return res.ok('Vouchers received', {
            vouchers: vouchers
        });
    },
    createVoucher: async (req, res) => {
        let { code, name, description, amount, quantity, expiry } = req.body;
        await Voucher.create({
            code,
            name,
            description,
            amount,
            quantity,
            expiry: new Date(expiry)
        });
        return res.ok('Successfully created the voucher.');
    },
    redeemVoucher: async (req, res) => {
        let { code } = req.body;
        let user = req.user;
        let voucher = await Voucher.findOne({ code });
        if (!voucher) {
            return res.bad_request('No voucher found with that code.');
        }
        if (voucher.expiry < new Date()) {
            return res.bad_request('That voucher code has expired.');
        }
        if (voucher.usage.includes(user._id)) {
            return res.bad_request('You have already redeemed this ticket.');
        }
        if (voucher.quantity === 0) {
            return res.bad_request('That voucher code has been completely redeemed.');
        }
        voucher.usage.push(user._id);
        voucher.quantity -= 1;
        await voucher.save();
        user.credits += voucher.amount;
        await user.save();
        return res.ok('Successfully redeemed Voucher.');
    },
    getVoucherById: async (req, res) => {
        let { id } = req.params;
        let voucher = await Voucher.findOne({ _id: id });
        if (!voucher) {
            return res.bad_request("Voucher not found.");
        }
        return res.ok('Successfully received voucher information', {
            voucher
        });
    },
};
