const Cache = require("memory-cache").Cache;

const { Notification, User, Payment } = require('../models');
const { createBill } = require('../middleware/billplz');
const { sendPaymentNotification, removeNotification } = require('../middleware/notification');
const { BadRequestError, ForbiddenError } = require('../errors');
const paymentCache = new Cache();

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
    getPayments: async (req) => {
        let user = req.user;
        let payments = await Payment.find({ $or: [{ from: user._id }, { to: user._id }] }).populate('from', 'f_name l_name contact').populate('to', 'f_name l_name contact');
        return {
            user,
            payments
        };
    },
    sendPayment: async (req) => {
        let { to, amount, reason, description } = req.body;
        let user = req.user;
        let from = user._id.toString();
        let toUser = await checkPayment(from, to);
        if (typeof toUser === 'string') {
            throw new BadRequestError(toUser);
        }
        if (amount > user.credits) {
            throw new BadRequestError("Insufficient funds in volet.");
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
        sendPaymentNotification(user, payment);
        sendPaymentNotification(toUser, payment);
    },
    requestPayment: async (req) => {
        let { payments } = req.body;
        let user = req.user;
        let to = user._id.toString();
        for (let i = 0; i < payments.length; i++) {
            let { from, reason, amount, description } = payments[i];
            let toUser = await checkPayment(from, to);
            if (typeof toUser === 'string') {
                throw new BadRequestError(toUser);
            }
            let payment = await Payment.create({
                from,
                to,
                amount,
                reason,
                description,
                status: 'Pending'
            });
            sendPaymentNotification(user, payment);
            sendPaymentNotification(toUser, payment);
        }
    },
    topUpVolet: async (req) => {
        let { amount, redirect_url } = req.body;
        try {
            let bill = await createBill(req.user, amount, "Top Up", redirect_url);
            return {
                bill
            };
        } catch (e) {
            throw new BadRequestError(e.message);
        }
    },
    withdrawFromAgent: async (req) => {
        let { agent_id, amount } = req.body;
        let user = req.user;
        let toUser = await checkPayment(user._id, agent_id);
        if (typeof toUser === 'string') {
            throw new BadRequestError(toUser);
        }
        let payment = await Payment.create({
            from: user._id,
            to: agent_id,
            amount,
            reason: 'Agent Withdrawal',
            status: 'Requested'
        });
        let notification = await sendPaymentNotification(toUser, payment);
        paymentCache.put(
            payment._id,
            async (accepted) => {
                payment.status = accepted ? 'Pending' : 'Rejected';
                await payment.save();
                return {
                    accepted: accepted
                }
            },
            60 * 1000,
            async () => {
                await removeNotification(notification);
                await payment.delete();
                return {
                    accepted: false
                }
            }
        );
    },
    acceptWithdrawal: async (req) => {
        let { payment_id } = req.body;
        let user = req.user;
        let payment = await Payment.findOne({ _id: payment_id });
        if (!payment) {
            throw new BadRequestError("Cannot find that payment.");
        }
        if (user._id.toString() !== payment.to.toString()) {
            throw new ForbiddenError();
        }
        let paymentCallback = paymentCache.get(payment_id);
        if (paymentCache.del(payment_id)) {
            await paymentCallback(true);
        }
    },
    rejectWithdrawal: async (req) => {
        let { payment_id } = req.body;
        let user = req.user;
        let payment = await Payment.findOne({ _id: payment_id });
        if (!payment) {
            throw new BadRequestError("Cannot find that payment.");
        }
        if (user._id.toString() !== payment.to.toString()) {
            throw new ForbiddenError();
        }
        let paymentCallback = paymentCache.get(payment_id);
        if (paymentCache.del(payment_id)) {
            await paymentCallback(false);
        }
    }
};