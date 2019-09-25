const { Expo } = require('expo-server-sdk/build/ExpoClient');

const {Push,User} = require('../models');

const expo = new Expo();

module.exports = {
    getPush: async (req) => {
        let push = await Push.find({});
        return {
            push: push
        };
    },
    createPush: async (req) => {
        let { title, description } = req.body;

        let push = {
            title,
            description
        };

        let messages = [];

        let user = await User.find({});
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

        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error(error);
            }
        }
        await Push.create(push);
    }
};