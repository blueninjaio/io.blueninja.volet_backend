const { Notification, User, Payment } = require('../../models');
const { createBill } = require('../../middleware/billplz');

async function checkPayment(from, to) {
    if (to === from) {
        return "You cannot send a payment to yourself.";
    }
    let toUser = await User.findOne({ _id: to });
    if (!toUser) {
        return "Cannot find user to send to.";
    }
    return toUser;
}

module.exports = {
    getPayments: async (req, res) => {
        let user = req.user;
        let payments = await Payment.find({ $or: [{ from: user._id }, { to: user._id }] }).populate('from').populate('to');
        return res.ok('Successfully requested.', {
            payments
        });
    },
    sendPayment: async (req, res) => {
        let { to, amount, reason, description } = req.body;
        let user = req.user;
        let from = user._id.toString();
        let toUser = await checkPayment(from, to);
        if (typeof toUser === 'string') {
            return res.badRequest(toUser);
        }
        if (amount > user.credits) {
            return res.badRequest("Insufficient funds in volet.");
        }
        amount = parseInt(amount);
        user.credits -= amount;
        await user.save();
        toUser.credits += amount;
        await toUser.save();
        let payment = await Payment.create({
            from,
            to,
            amount,
            reason,
            description,
            status: 'Complete'
        });
        user.notifications.push({
            payment: payment._id
        });
        await user.save();
        return res.ok('Successfully transferred.');
    },
    requestPayment: async (req, res) => {
        let { payments } = req.body;
        let user = req.user;
        let to = user._id.toString();
        for (let i = 0; i < payments.length; i++) {
            let { from, reason, amount, description } = payments[i];
            let toUser = await checkPayment(from, to);
            if (typeof toUser === 'string') {
                return res.badRequest(toUser);
            }
            let payment = await Payment.create({
                from,
                to,
                amount,
                reason,
                description,
                status: 'Pending'
            });
            user.notifications.push({
                payment: payment._id
            });
            toUser.notifications.push({
                payment: payment._id
            });
            await toUser.save();
        }
        await user.save();
        return res.ok('Successfully requested.');
    },
    topUpVolet: async (req, res) => {
        let { amount, redirect_url } = req.body;
        try {
            let bill = await createBill(req.user, amount, "Top Up", redirect_url);
            return res.ok(bill);
        } catch (e) {
            return res.badRequest(e.message);
        }
    },
    withdrawFromAgent: async (req, res) => {
        let { agent_id, amount } = req.body;
        let user = req.user;
        let toUser = await checkPayment(user._id, agent_id);
        if (typeof toUser === 'string') {
            return res.badRequest(toUser);
        }
        await Payment.create({
            from: user._id,
            to: agent_id,
            amount,
            reason: 'Agent Withdrawal',
            status: 'Requested'
        });
        return res.ok('Agent has been notified of your request.');
    },
    acceptWithdrawal: async (req, res) => {
        let { payment_id } = req.body;
        let user = req.user;
        let payment = await Payment.findOne({ _id: payment_id });
        if (!payment) {
            return res.badRequest("Cannot find that payment.");
        }
        if (user._id !== payment.to) {
            return res.forbidden();
        }
        payment.status = 'Pending';
        await payment.save();
        return res.ok('Accepted requested payment.');
    },
    rejectWithdrawal: async (req, res) => {
        let { payment_id } = req.body;
        let user = req.user;
        let payment = await Payment.findOne({ _id: payment_id });
        if (!payment) {
            return res.badRequest("Cannot find that payment.");
        }
        if (user._id !== payment.to) {
            return res.forbidden();
        }
        payment.status = 'Rejected';
        await payment.save();
        return res.ok('Rejected payment request.');
    }
};