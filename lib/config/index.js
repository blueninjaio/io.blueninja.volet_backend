const DATABASE_URL = process.env.DATABASE_URL
const DATABASE_NAME = process.env.DATABASE_NAME
const ENV = process.env.NODE_ENV

const commonConfigs = {
  port: 80,
  mongoose: {
    uri: `mongodb://${DATABASE_URL}/${DATABASE_NAME}`,
    options: { useNewUrlParser: true },
  },
  private_key: 'blueninja',
  currency_api_key: 'bbdef8c657174ac8bd18',
  billplz: {
    endpoint: 'https://www.billplz.com/api/v3',
    secret: '18ccb3e6-2ccf-48df-ac9e-5113c2a57c00',
    x_signature_key: 'S-2QI6TDE0YSqhGawWWy-HiA',
    collection_id: 'oxylfiq_',
  },
  tac: {
    expiry: 90,
    length: 6,
  },
  isms: {
    username: "Voletapp", //user isms username
    password: "F7FqA4fBhcxUk8J",	//user isms password
    type: 2, //for unicode change to 2, normal will the 1.
    sender_id: "Volet" //Malaysia does not support sender id yet.
  },
  local_endpoint: 'http://127.0.0.1:80/api',
}

const config = {
  production: {
    ...commonConfigs,
  },
  dev: {
    ...commonConfigs,
  },
  staging: {
    ...commonConfigs,
  },
  test: {
    ...commonConfigs,
    port: 81,
    mongoose: {
      ...commonConfigs.mongoose,
      uri: `mongodb://${DATABASE_URL}/${DATABASE_NAME}-test`,
    }
  },
}

// Export the module
module.exports = config[ENV]
