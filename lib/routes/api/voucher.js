const { Voucher } = require('../../models');
const { BadRequestError } = require('../../errors');

module.exports = {
  getVouchers: async () => {
    const vouchers = await Voucher.find({});
    return {
      vouchers: vouchers
    };
  },
  createVoucher: async (req) => {
    const { code, name, description, amount, quantity, expiry } = req.body;
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
    const { code } = req.body;
    const user = req.user;
    const voucher = await Voucher.findOne({ code });
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
    const { id } = req.params;
    const voucher = await Voucher.findOne({ _id: id });
    if (!voucher) {
      throw new BadRequestError('Voucher not found.');
    }
    return {
      voucher
    };
  }
};
