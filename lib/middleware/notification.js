const {sendPush} = require("./expo");
const { Notification } = require('../models');

module.exports = {
    sendPaymentNotification: async (user, payment) => {
        let notification = await Notification.create({
            payment
        });
        user.notifications.push(notification._id);
        await user.save();
        await sendPush("Payment push notification", [user.push_token]);
    },
    sendVoucherNotification: async (user, voucher) => {
        let notification = await Notification.create({
            voucher
        });
        user.notifications.push(notification._id);
        await user.save();
        await sendPush("Voucher push notification", [user.push_token]);
    },
    sendNotification: async (user, message) => {
        let notification = await Notification.create({
            message
        });
        user.notifications.push(notification._id);
        await user.save();
        await sendPush(message, [user.push_token]);
    }
};