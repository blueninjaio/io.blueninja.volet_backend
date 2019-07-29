var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var port = 80

var admin = require('./routes/api/admin/AdminController')
var users = require('./routes/api/user/UserController')
var agents = require('./routes/api/agent/AgentController')
var merchants = require('./routes/api/merchant/MerchantController')
var business = require('./routes/api/business/BusinessController')
var business_category = require('./routes/api/business_category/BusinessCategoryController')
var business_type = require('./routes/api/business_type/BusinessTypeController')
var currency = require('./routes/api/currency/CurrencyController')
var bank = require('./routes/api/bank/BankController')
var payment_method = require('./routes/api/payment_method/PaymentMethodController')
var vouchers = require('./routes/api/voucher/VoucherController')
var feedbacks = require('./routes/api/feedback/FeedbackController')
var push = require('./routes/api/push/PushController')
var item = require('./routes/api/item/ItemController')
var static = require('./routes/api/static/StaticController')
var volet = require('./routes/api/volet/VoletController')

var mongoose = require('mongoose')
mongoose.connect('mongodb://mongo:27017/volet', { useNewUrlParser: true })

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}))

app.use('/api/admin', admin)
app.use('/api/users', users)
app.use('/api/agents', agents)
app.use('/api/merchants', merchants)
app.use('/api/business', business)
app.use('/api/business_category', business_category)
app.use('/api/business_type', business_type)
app.use('/api/bank', bank)
app.use('/api/currency', currency)
app.use('/api/payment_method', payment_method)
app.use('/api/vouchers', vouchers)
app.use('/api/feedbacks', feedbacks)
app.use('/api/push', push)
app.use('/api/item', item)
app.use('/api/static', static)
app.use('/api/volet', volet)

app.use(express.static(path.join(__dirname, 'client/build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})


app.listen(port)
module.exports = app

