const Voucher = require('../../models/voucher');
const Volet = require('../../models/volet');

module.exports = {
    getVouchers: async (req, res) => {
        let vouchers = await Voucher.find({});
        return res.ok('Vouchers received', {
            vouchers: vouchers
        });
    },
    createVoucher: async (req, res) => {
        let { name, description, amount, quantity, expiry } = req.body;


        let newVoucher = {
            name,
            description,
            amount,
            quantity,
            expiry: new Date(expiry)
        };

        await Voucher.create(newVoucher);
        return res.ok('Successfully created the voucher.');
    },
    redeemVoucher: async (req, res) => {
        let { name, user, user_id } = req.body;

        let voucher = await Voucher.findOne({ name });
        let amount = voucher.amount;

        if (voucher.usage.includes(user)) {
            return res.bad_request('You have already redeemed this ticket.');
        }
        let newVolet = {
            persona_id: user_id,
            persona_model: 'User',
            amount
        };

        await Volet.create(newVolet);
        let newUsage = {
            user,
            date: Date.now()
        };

        let newUsages = voucher.usage;
        newUsages.push(newUsage);

        let update = {
            usage: newUsages,
            quantity: voucher.quantity - 1
        };

        await Voucher.updateOne({}, update);
        return res.ok('Successfully redeemed Voucher.');
    }
};
