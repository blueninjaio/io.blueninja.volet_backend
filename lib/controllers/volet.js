const Cache = require('memory-cache').Cache;

const { User, Payment } = require('../models');
const { createBill } = require('../middleware/billplz');
const { sendPaymentNotification, removeNotification } = require('../middleware/notification');
const { BadRequestError, ForbiddenError } = require('../errors');
const paymentCache = new Cache();

async function checkPayment(from, to) {
  if (to === from) {
    return 'You cannot send a payment to yourself.';
  }
  const toUser = await User.findOne({ _id: to });
  if (!toUser) {
    return 'Cannot find user to send to.';
  }
  return toUser;
}

module.exports = {
  getPayments: async (req) => {
    const user = req.user;
    const payments = await Payment.find({ $or: [{ from: user._id }, { to: user._id }] }).populate('from', 'f_name l_name contact').populate('to', 'f_name l_name contact');
    return {
      user,
      payments
    };
  },
  sendPayment: async (req) => {
    let { amount } = req.body;
    const { to, reason, description } = req.body;
    const user = req.user;
    const from = user._id.toString();
    const toUser = await checkPayment(from, to);
    if (typeof toUser === 'string') {
      throw new BadRequestError(toUser);
    }
    if (amount > user.credits) {
      throw new BadRequestError('Insufficient funds in volet.');
    }
    amount = parseInt(amount);
    user.credits -= amount;
    await user.save();
    toUser.credits += amount;
    await toUser.save();
    const payment = await Payment.create({
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
    const { payments } = req.body;
    const user = req.user;
    const to = user._id.toString();
    for (let i = 0; i < payments.length; i++) {
      const { from, reason, amount, description } = payments[i];
      const toUser = await checkPayment(from, to);
      if (typeof toUser === 'string') {
        throw new BadRequestError(toUser);
      }
      const payment = await Payment.create({
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
  acceptPayment: async (req) => {
    const { _id } = req.body;
    const user = req.user;
    const payment = await Payment.findOne({ _id });
    if (!payment) {
      throw new BadRequestError('Cannot find payment with that ID.');
    }
    if (user._id.toString() !== payment.from.toString()) {
      throw new ForbiddenError('This is not a payment you are allowed to accept.');
    }
    if (payment.status !== 'Pending') {
      throw new BadRequestError('This is not a pending payment.');
    }
    payment.status = 'Complete';
    if (payment.amount > user.credits) {
      throw new BadRequestError('Insufficient funds in volet.');
    }
    const toUser = await User.findOne({ _id: payment.to });
    user.credits -= payment.amount * 100;
    await user.save();
    toUser.credits += payment.amount * 100;
    await toUser.save();
  },
  topUpVolet: async (req) => {
    const { amount, redirect_url } = req.body;
    try {
      const bill = await createBill(req.user, amount, 'Top Up', redirect_url);
      return {
        bill
      };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  },
  withdrawFromAgent: async (req, res) => {
    const { agent_id, amount } = req.body;
    console.log(agent_id, amount);
    const user = req.user;
    const toUser = await checkPayment(user._id, agent_id);
    if (typeof toUser === 'string') {
      throw new BadRequestError(toUser);
    }
    const payment = await Payment.create({
      from: user._id,
      to: agent_id,
      amount,
      reason: 'Agent Withdrawal',
      status: 'Requested'
    });
    const notification = await sendPaymentNotification(toUser, payment);
    paymentCache.put(
      payment._id,
      async (accepted) => {
        if (!accepted) {
          await removeNotification(user, notification);
        }
        payment.status = accepted ? 'Pending' : 'Rejected';
        await payment.save();
        res.status(200).send({
          success: true,
          accepted: accepted,
          payment
        });
      },
      60 * 1000,
      async () => {
        await removeNotification(user, notification);
        await payment.delete();
        res.status(200).send({
          success: true,
          accepted: false,
          payment
        });
      }
    );
  },
  acceptWithdrawal: async (req) => {
    const { payment_id } = req.body;
    const user = req.user;
    const payment = await Payment.findOne({ _id: payment_id });
    if (!payment) {
      throw new BadRequestError('Cannot find that payment.');
    }
    if (user._id.toString() !== payment.to.toString()) {
      throw new ForbiddenError();
    }
    const paymentCallback = paymentCache.get(payment_id);
    if (paymentCache.del(payment_id)) {
      await paymentCallback(true);
    }
  },
  rejectWithdrawal: async (req) => {
    const { payment_id } = req.body;
    const user = req.user;
    const payment = await Payment.findOne({ _id: payment_id });
    if (!payment) {
      throw new BadRequestError('Cannot find that payment.');
    }
    if (user._id.toString() !== payment.to.toString()) {
      throw new ForbiddenError();
    }
    const paymentCallback = paymentCache.get(payment_id);
    if (paymentCache.del(payment_id)) {
      await paymentCallback(false);
    }
  }
};