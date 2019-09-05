const PaymentMethod = require('../../models/payment-method');

module.exports = {
    getPaymentMethods: async (req, res) => {
        let payment_methods = await PaymentMethod.find({});
        return res.ok('Payment methods received', {
            payment_methods: payment_methods
        });
    },
    createPaymentMethod: async (req, res) => {
        let { name, description } = req.body;

        let newPaymentMethod = {
            name,
            description,
        };

        await PaymentMethod.create(newPaymentMethod);
        return res.ok('Successfully created the payment method.');
    }
};