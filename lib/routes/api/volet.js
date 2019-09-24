const { User, UserPayment } = require('../../models');
const { createBill } = require('../../middleware/billplz');

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
  getPayments: async (req, res) => {
    const user = req.user;
    const payments = await UserPayment.find({ $or: [{ from: user._id }, { to: user._id }] }).populate('from').populate('to');
    return res.ok('Successfully requested.', {
      payments
    });
  },
  sendPayment: async (req, res) => {
    const { to, amount, reason, description } = req.body;
    const user = req.user;
    const from = user._id.toString();
    const toUser = await checkPayment(from, to);
    if (typeof toUser === 'string') {
      return res.badRequest(toUser);
    }
    if (amount > user.credits) {
      return res.badRequest('Insufficient funds in volet.');
    }
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
      status: 'Completed'
    });
    return res.ok('Successfully transferred.');
  },
  requestPayment: async (req, res) => {
    const { payments } = req.body;
    const user = req.user;
    const to = user._id.toString();
    for (let i = 0; i < payments.length; i++) {
      const { from } = payments[i];
      const toUser = await checkPayment(from, to);
      if (typeof toUser === 'string') {
        return res.badRequest(toUser);
      }
    }
    const queries = [];
    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i];
      const { from, amount, reason, description } = payment;
      queries.push(UserPayment.create({
        from,
        to,
        amount,
        reason,
        description,
        status: 'Pending'
      }));
    }
    await Promise.all(queries);
    return res.ok('Successfully requested.');
  },
  topUpVolet: async (req, res) => {
    const { amount, redirect_url } = req.body;
    try {
      const bill = await createBill(req.user, amount, 'Top Up', redirect_url);
      return res.ok(bill);
    } catch (e) {
      return res.badRequest(e.message);
    }
  },
  withdrawFromAgent: async (req, res) => {
    const { agent_id, amount } = req.body;
    const user = req.user;
    const toUser = await checkPayment(user._id, agent_id);
    if (typeof toUser === 'string') {
      return res.badRequest(toUser);
    }
    await UserPayment.create({
      from: user._id,
      to: agent_id,
      amount,
      reason: 'Agent Withdrawal',
      status: 'Requested'
    });
    return res.ok('Agent has been notified of your request.');
  },
  acceptWithdrawal: async (req, res) => {
    const { payment_id } = req.body;
    const user = req.user;
    const payment = await UserPayment.findOne({ _id: payment_id });
    if (!payment) {
      return res.badRequest('Cannot find that payment.');
    }
    if (user._id !== payment.to) {
      return res.forbidden();
    }
    payment.status = 'Pending';
    await payment.save();
    return res.ok('Accepted requested payment.');
  },
  rejectWithdrawal: async (req, res) => {
    const { payment_id } = req.body;
    const user = req.user;
    const payment = await UserPayment.findOne({ _id: payment_id });
    if (!payment) {
      return res.badRequest('Cannot find that payment.');
    }
    if (user._id !== payment.to) {
      return res.forbidden();
    }
    payment.status = 'Rejected';
    await payment.save();
    return res.ok('Rejected payment request.');
  }
};
