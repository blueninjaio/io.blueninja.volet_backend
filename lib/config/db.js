const mongoose = require('mongoose')

const { mongoose: mongooseConfig } = require('./index')

const connectWithRetry = () => {
  console.log('Retrying Mongodb connection')
  mongoose.connect(mongooseConfig.uri, mongooseConfig.options)
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => {
      console.log(`Could not connect to MongoDB: ${err}:${err.stack}`)
      setTimeout(connectWithRetry, 5000)
    })
}
connectWithRetry()

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected due to app termination')
    process.exit(0)
  })
})
