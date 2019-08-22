const production = {
    port: 80,
    mongoose: {
        uri: 'mongodb://mongo:27017/volet',
        options: { useNewUrlParser: true }
    },
    private_key: 'blueninja',
    currency_api_key: 'bbdef8c657174ac8bd18',
    billplz: {
        endpoint: 'https://www.billplz.com/api/v3',
        secret: '18ccb3e6-2ccf-48df-ac9e-5113c2a57c00',
        x_signature_key: 'S-2QI6TDE0YSqhGawWWy-HiA',
        collection_id: 'oxylfiq_'
    },
    tac: {
        cache_time: 90 * 1000,
        length: 6
    },
    isms: {
        username: "Voletapp", //user isms username
        password: "F7FqA4fBhcxUk8J",	//user isms password
        type: 2, //for unicode change to 2, normal will the 1.
        sender_id: "Volet" //Malaysia does not support sender id yet.
    },
    local_endpoint: 'http://127.0.0.1:8080/api'
};

const environments = {
    production: production,
    dev: Object.assign(production, {
        port: 8080,
        mongoose: {
            uri: 'mongodb://localhost:27017/volet',
            options: { useNewUrlParser: true }
        },
        private_key: 'blueninja',
        currency_api_key: 'bbdef8c657174ac8bd18',
        billplz: {
            endpoint: 'https://billplz-staging.herokuapp.com/api/v3',
            secret: '18ccb3e6-2ccf-48df-ac9e-5113c2a57c00',
            x_signature_key: 'S-s7b4yWpp9h7rrkNM1i3Z_g',
            collection_id: 'cn5tiucb'
        },
        tac: {
            cache_time: 90 * 1000,
            length: 6
        },
        isms: {
            username: "Voletapp", //user isms username
            password: "F7FqA4fBhcxUk8J",	//user isms password
            type: 2, //for unicode change to 2, normal will the 1.
            sender_id: "Volet" //Malaysia does not support sender id yet.
        },
        local_endpoint: 'http://127.0.0.1/api'
    })
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV == "string" ? process.env.NODE_ENV.toLowerCase() : "production";

// Export the module
module.exports = typeof environments[currentEnvironment] == "object" ? environments[currentEnvironment] : production;