const { PaymentReason, User, UserPayment } = require('../../models');
const { createBill } = require('../../middleware/billplz');

async function checkPayment(from, to, reason) {
    if (to === from) {
        return "You cannot send a payment to yourself.";
    }
    let toUser = await User.findOne({_id: to });
    if (!toUser) {
        return "Cannot find user to send to.";
    }
    let paymentReason = await PaymentReason.findOne({ name: reason });
    if (!paymentReason) {
        return "Could not find payment reason.";
    }
    return paymentReason._id;
}

module.exports = {
    getPayments:  async (req, res) => {
        let user = req.user;
        let payments = await UserPayment.find({ $or: [{ from: user._id }, { to: user._id }] }).populate('from').populate('to').populate('reason');
        return res.ok('Successfully requested.', {
            payments
        });
    },
    sendPayment: async (req, res) => {
        let { to, amount, reason, description } = req.body;
        let user = req.user;
        let from = user._id.toString();
        reason = await checkPayment(from, to, reason);
        if (typeof reason === 'string') {
            return res.bad_request(reason);
        }
        if (amount > user.credits) {
            return res.bad_request("Insufficient funds in volet.");
        }
        let toUser = await User.findOne({_id: to });
        user.credits -= amount;
        await user.save();
        toUser.credits += amount;
        await toUser.save();
        await UserPayment.create({
            from,
            to,
            amount,
            reason,
            description,
            pending: false
        });
        return res.ok('Successfully transferred.');
    },
    requestPayment: async (req, res) => {
        let { payments } = req.body;
        let user = req.user;
        let to = user._id.toString();
        for (let i = 0; i < payments.length; i++) {
            let { from, reason } = payments[i];
            reason = await checkPayment(from, to, reason);
            if (typeof reason === 'string') {
                return res.bad_request(reason);
            }
            payments[i].reason = reason;
        }
        let queries = [];
        for (let i = 0; i < payments.length; i++) {
            let payment = payments[i];
            let { from, amount, reason, description } = payment;
            queries.push(UserPayment.create({
                from,
                to,
                amount,
                reason,
                description,
                pending: true
            }));
        }
        await Promise.all(queries);
        return res.ok('Successfully requested.');
    },
    topUpVolet: async (req, res) => {
        let { amount, redirect_url } = req.body;
        let bill = await createBill(req.user, amount, "Top Up", redirect_url);
        return res.ok(bill);
    },
    withdrawFromAgent: async (req, res) => {
        let { agent_id, amount } = req.body;
        let user = req.user;
        let reason = await checkPayment(user._id, agent_id, "Agent Withdrawal");
        if (typeof reason === 'string') {
            return res.bad_request(reason);
        }
        await UserPayment.create({
            from: user._id,
            to: agent_id,
            amount,
            reason,
            pending: true
        });
    },
    acceptWithdraw: async (req, res) => {
        let { amount } = req.body;
        let user = req.user;
    }
};