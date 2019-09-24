const BillPlz = require('../../middleware/billplz');

module.exports = {
  callbackBillplz: async (req, res) => {
    const { id, collection_id, paid, state, amount, paid_amount, due_at, email, mobile, name, url, paid_at, x_signature } = req.body;
    const user = await BillPlz.validateCallback(id, collection_id, paid, state, amount, paid_amount, due_at, email, mobile, name, url, paid_at, x_signature);
    if (user) {
      user.credits += parseInt(paid_amount);
      user.save();
    }
    return res.ok();
  }
};