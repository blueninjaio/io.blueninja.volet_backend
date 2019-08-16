let port;
let mongoUri;
if (process.env.NODE_ENV === "dev") {
    port = 8080;
    mongoUri = 'mongodb://mongo:27017/volet';
} else {
    port = 80;
    mongoUri = 'mongodb://mongo:27017/volet';
}
module.exports = {
    port: port,
    mongoose: {
        uri: mongoUri,
        options: { useNewUrlParser: true }
    },
    secret: 'blueninja',
    currency_api_key: 'bbdef8c657174ac8bd18'
};