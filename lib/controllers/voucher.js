const {Voucher} = require('../models');
const { BadRequestError } = require('../errors');

module.exports = {
    getVouchers: async (req) => {
        let vouchers = await Voucher.find({});
        return {
            vouchers: vouchers
        };
    },
    createVoucher: async (req) => {
        let { code, name, description, amount, quantity, expiry } = req.body;
        await Voucher.create({
            code,
            name,
            description,
            amount,
            quantity,
            expiry: new Date(expiry)
        });
    },
    redeemVoucher: async (req) => {
        let { code } = req.body;
        let user = req.user;
        let voucher = await Voucher.findOne({ code });
        if (!voucher) {
            throw new BadRequestError('No voucher found with that code.');
        }
        if (voucher.expiry < new Date()) {
            throw new BadRequestError('That voucher code has expired.');
        }
        if (voucher.usage.includes(user._id)) {
            throw new BadRequestError('You have already redeemed this ticket.');
        }
        if (voucher.quantity === 0) {
            throw new BadRequestError('That voucher code has been completely redeemed.');
        }
        voucher.usage.push(user._id);
        voucher.quantity -= 1;
        await voucher.save();
        user.credits += voucher.amount;
        await user.save();
    },
    getVoucherById: async (req) => {
        let { id } = req.params;
        let voucher = await Voucher.findOne({ _id: id });
        if (!voucher) {
            throw new BadRequestError("Voucher not found.");
        }
        return {
            voucher
        };
    }
};
