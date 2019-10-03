const { Expo } = require('expo-server-sdk/build/ExpoClient');

const { Push,User } = require('../models');

const expo = new Expo();

module.exports = {
  getPush: async (req) => {
    const push = await Push.find({});
    return {
      push: push
    };
  },
  createPush: async (req) => {
    const { title, description } = req.body;

    const push = {
      title,
      description
    };

    const messages = [];

    const user = await User.find({});
    user.map((x, i) => {
      if (x.push_token) {
        if (Expo.isExpoPushToken(x.push_token)) {
          messages.push({
            to: x.push_token,
            title: title,
            body: description
          });
        }
      }
    });

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
    await Push.create(push);
  }
};