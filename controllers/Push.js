const { Expo } = require('expo-server-sdk/build/ExpoClient');

const Push = require('../models/Push');
const User = require('../models/User')

const expo = new Expo();

module.exports = {
    getAll: (req, res) => {
        Push.find({}, (err, push) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Server Error"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    push: push,
                    message: "Push received"
                })
            }
        })
    },
    create: async (req, res) => {
        let {
            title,
            description,
        } = req.body;

        let push = {
            title,
            description
        };

        let messages = [];

        await User.find({}, (err, user) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error: Server Error"
                });
            } else {
                user.map((x, i) => {
                    if (x.push_token) {
                        if (Expo.isExpoPushToken(x.push_token)) {
                            messages.push({
                                to: x.push_token,
                                title: title,
                                body: description,
                            })
                        }
                    }
                })
            }
        });

        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        await (async () => {
            for (let chunk of chunks) {
                try {
                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    tickets.push(...ticketChunk)
                } catch (error) {
                    console.error(error)
                }
            }
        })();

        Push.create(push, (err, push) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "There was a problem creating the activity"
                });
            }

            return res.status(200).send({
                success: true,
                message: "Push notification was successfully created"
            })
        })
    }
};