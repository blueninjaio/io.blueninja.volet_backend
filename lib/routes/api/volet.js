const Cache = require('memory-cache').Cache;

const { User, Payment } = require('../../models');
const { createBill } = require('../../middleware/billplz');
const { sendPaymentNotification } = require('../../middleware/notification');
const { BadRequestError, ForbiddenError } = require('../../errors');
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
    const payments = await Payment.find({ $or: [{ from: user._id }, { to: user._id }] }).populate('from').populate('to');
    return {
      payments
    };
  },
  sendPayment: async (req) => {
    const { to, amount: requestedAmount, reason, description } = req.body;
    const user = req.user;
    const from = user._id.toString();
    const toUser = await checkPayment(from, to);
    if (typeof toUser === 'string') {
      throw new BadRequestError(toUser);
    }
    const amount = parseInt(requestedAmount);
    if (amount > user.credits) {
      throw new BadRequestError('Insufficient funds in volet.');
    }
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
  withdrawFromAgent: async (req) => {
    const { agent_id, amount } = req.body;
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
    sendPaymentNotification(toUser, payment);
    paymentCache.put(
      payment._id,
      async (accepted) => {
        payment.status = accepted ? 'Pending' : 'Rejected';
        await payment.save();
        return {
          accepted: accepted
        };
      },
      60 * 1000,
      async () => {
        await payment.delete();
        return {
          accepted: false
        };
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
    if (user._id !== payment.to) {
      throw new ForbiddenError();
    }
    const paymentCallback = paymentCache.get(payment_id);
    if (paymentCache.del(payment_id)) {
      await paymentCallback(true);
    }
  },
  rejectWithdrawal: async (req, res) => {
    const { payment_id } = req.body;
    const user = req.user;
    const payment = await Payment.findOne({ _id: payment_id });
    if (!payment) {
      throw new BadRequestError('Cannot find that payment.');
    }
    if (user._id !== payment.to) {
      throw new ForbiddenError();
    }
    const paymentCallback = paymentCache.get(payment_id);
    if (paymentCache.del(payment_id)) {
      await paymentCallback(false);
    }
    payment.status = 'Rejected';
    await payment.save();
    return res.ok('Rejected payment request.');
  }
};
