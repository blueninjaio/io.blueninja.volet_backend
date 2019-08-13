let express = require('express');
let RouteHandler = require('../util/RouteHandler');
let router = express.Router();

let adminController = require('../controllers/Admin');
router.get('/admin', RouteHandler(adminController.getAll));
router.post('/admin', RouteHandler(adminController.create));
router.post('/admin/login', RouteHandler(adminController.login));
router.post('/admin/me', RouteHandler(adminController.verifyUser));
router.post('/admin/forgotPassword', RouteHandler(adminController.forgotPassword));
router.post('/admin/changePassword', RouteHandler(adminController.changePassword));
router.post('/admin/changeEmail', RouteHandler(adminController.changeEmail));

let agentController = require('../controllers/Agent');
router.get('/agents', RouteHandler(agentController.getAll));
router.post('/agents', RouteHandler(agentController.create));
router.post('/agents/approve', RouteHandler(agentController.approve));
router.post('/agents/decline', RouteHandler(agentController.decline));

let bankController = require('../controllers/Bank');
router.get('/bank', RouteHandler(bankController.getAll));
router.post('/bank', RouteHandler(bankController.create));

let businessController = require('../controllers/Business');
router.get('/business', RouteHandler(businessController.getAll));
router.post('/business', RouteHandler(businessController.register));
router.get('/business/registrationInformation', RouteHandler(businessController.registrationInformation));
router.post('/business/approve', RouteHandler(businessController.approve));
router.post('/business/decline', RouteHandler(businessController.decline));
router.post('/business/info', RouteHandler(businessController.updateInfo));
router.get('/business/getTypes', RouteHandler(businessController.getTypes));

let businessCategoryController = require('../controllers/BusinessCategory');
router.get('/business_category', RouteHandler(businessCategoryController.getAll));
router.post('/business_category', RouteHandler(businessCategoryController.create));
router.post('/business_category/business', RouteHandler(businessCategoryController.get));

let businessTypeController = require('../controllers/BusinessType');
router.get('/business_type', RouteHandler(businessTypeController.getAll));
router.post('/business_type', RouteHandler(businessTypeController.create));

let currencyController = require('../controllers/Currency');
router.post('/currency', RouteHandler(currencyController.create));
router.get('/currency', RouteHandler(currencyController.getAll));
router.post('/currency/convert', RouteHandler(currencyController.convert));

let feedbackController = require('../controllers/Feedback');
router.get('/feedbacks', RouteHandler(feedbackController.getAll));
router.post('/feedbacks', RouteHandler(feedbackController.create));

let itemController = require('../controllers/Item');
router.post('/item/add', RouteHandler(itemController.add));
router.post('/item/remove', RouteHandler(itemController.remove));
router.post('/item/business', RouteHandler(itemController.business));

let merchantController = require('../controllers/Merchant');
router.get('/merchants', RouteHandler(merchantController.getAll));
router.post('/merchants/id', RouteHandler(merchantController.getById));
router.post('/merchants', RouteHandler(merchantController.register));
router.post('/merchants/login', RouteHandler(merchantController.login));
router.post('/merchants/tempPassword', RouteHandler(merchantController.createTempPassword));
router.post('/merchants/resetPassword', RouteHandler(merchantController.resetPassword));
router.post('/merchants/updatePush', RouteHandler(merchantController.updatePushToken));
router.post('/merchants/removePush', RouteHandler(merchantController.removePushToken));

let paymentMethodController = require('../controllers/PaymentMethod');
router.post('/payment_method/', RouteHandler(paymentMethodController.create));
router.get('/payment_method/', RouteHandler(paymentMethodController.getAll));

let pushController = require('../controllers/Push');
router.get('/push', RouteHandler(pushController.getAll));
router.post('/push', RouteHandler(pushController.create));

let staticController = require('../controllers/Static');
router.get('/static', RouteHandler(staticController.getAll));
router.post('/static/faq', RouteHandler(staticController.editFaq));
router.post('/static/policies', RouteHandler(staticController.editPolicies));

let transactionController = require('../controllers/Transaction');
router.get('/transaction/user', RouteHandler(transactionController.getAllUserTransactions));
router.get('/transaction/userAgent', RouteHandler(transactionController.getAllUserAgentTransactions));
router.get('/transaction/merchant', RouteHandler(transactionController.getAllMerchantTransactions));
router.post('/transaction/user', RouteHandler(transactionController.createUserTransaction));
router.post('/transaction/userAgent', RouteHandler(transactionController.createUserAgentTransaction));
router.post('/transaction/merchant', RouteHandler(transactionController.createMerchantTransaction));

let userController = require('../controllers/User');
router.get('/users', RouteHandler(userController.getAll));
router.post('/users/id', RouteHandler(userController.getById));
router.post('/users', RouteHandler(userController.register));
router.post('/users/login', RouteHandler(userController.login));
router.post('/users/tempPassword', RouteHandler(userController.createTempPassword));
router.post('/users/resetPassword', RouteHandler(userController.resetPassword));
router.post('/users/updatePush', RouteHandler(userController.updatePushToken));
router.post('/users/removePush', RouteHandler(userController.removePushToken));
router.post('/users/me', RouteHandler(userController.verify));

let voletController = require('../controllers/Volet');
router.get('/volet', RouteHandler(voletController.getAll));
router.post('/volet', RouteHandler(voletController.create));
router.post('/volet/id', RouteHandler(voletController.calculate));

let voucherController = require('../controllers/Voucher');
router.get('/vouchers', RouteHandler(voucherController.getAll));
router.post('/vouchers', RouteHandler(voucherController.create));
router.post('/vouchers/redeem', RouteHandler(voucherController.redeem));

let toggleController = require('../controllers/Toggle');
router.post('/bank/toggle', RouteHandler(toggleController.bank));
router.post('/business_category/toggle', RouteHandler(toggleController.businessCategory));
router.post('/business_type/toggle', RouteHandler(toggleController.businessType));
router.post('/currency/toggle', RouteHandler(toggleController.currency));
router.post('/payment_method/toggle', RouteHandler(toggleController.paymentMethod));

module.exports = router;