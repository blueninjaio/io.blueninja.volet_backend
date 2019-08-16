const template = {
    port: 0,
    mongoose: {
        uri: '',
        options: {}
    },
    private_key: '',
    currency_api_key: '',
    billplz: {
        endpoint: '',
        secret: '',
        x_signature_key: '',
        collection_id: ''
    },
    endpoint: ''
};

const environments = {};
environments.production = {
    port: 80,
    mongoose: {
        uri: 'mongodb://localhost:27017/volet',
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
    endpoint: 'http://127.0.0.1:8080/api'
};

environments.dev = {
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
    endpoint: 'http://127.0.0.1/api'
};


// Determine which environment was passed as a command-line argument
const currentEnvironment =
    typeof process.env.NODE_ENV == "string"
        ? process.env.NODE_ENV.toLowerCase()
        : "";

// Check that the current environment is one of the environments above, if not, default to staging
const environmentToExport =
    typeof environments[currentEnvironment] == "object"
        ? environments[currentEnvironment]
        : environments.staging;

// Export the module
module.exports = environmentToExport ? environmentToExport : template;