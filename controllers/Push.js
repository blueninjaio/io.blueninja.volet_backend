const { Expo } = require('expo-server-sdk/build/ExpoClient');

const Push = require('../models/Push');
const User = require('../models/User');

const expo = new Expo();

module.exports = {
    getAll: async (req, res) => {
        let push = await Push.find({});
        return res.ok('Push received', {
            push: push
        });
    },
    create: async (req, res) => {
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
                        body: description,
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
        return res.ok('Push notification was successfully created');
    }
};