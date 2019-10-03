const { Notification } = require('../models');
const { sendPush } = require('./expo');

module.exports = {
  sendPaymentNotification: async (user, payment) => {
    const notification = await Notification.create({
      payment
    });
    user.notifications.push(notification._id);
    await user.save();
    await sendPush('Payment push notification', [user.push_token]);
    return notification;
  },
  sendVoucherNotification: async (user, voucher) => {
    const notification = await Notification.create({
      voucher
    });
    user.notifications.push(notification._id);
    await user.save();
    await sendPush('Voucher push notification', [user.push_token]);
    return notification;
  },
  sendNotification: async (user, message) => {
    const notification = await Notification.create({
      message
    });
    user.notifications.push(notification._id);
    await user.save();
    await sendPush(message, [user.push_token]);
    return notification;
  },
  removeNotification: async (user, notification) => {
    user.notifications = user.notifications.filter(n => notification._id !== n._id);
    await user.save();
    await notification.delete();
  }
};