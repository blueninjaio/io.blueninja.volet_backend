let port;
let mongoUri;
if (process.env.dev) {
    port = 8080;
    mongoUri = 'mongodb://localhost:27017/volet';
} else {
    port = 80;
    mongoUri = 'mongodb://localhost:27017/volet';
}
module.exports = {
    port: port,
    mongoose: {
        uri: mongoUri,
        options: { useNewUrlParser: true }
    },
    secret: 'blueninja'
};