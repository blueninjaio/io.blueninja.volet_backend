let express = require('express');
let RouteHandler = require('../util/RouteHandler');
let router = express.Router();

let adminController = require('../controllers/Admin');
router.get('/admin', RouteHandler('admin'), adminController.getAll);
router.post('/admin', RouteHandler('admin'), adminController.create);
router.post('/admin/login', RouteHandler(), adminController.login);
router.get('/admin/me', RouteHandler('admin'), adminController.verifyUser);
router.post('/admin/changePassword', RouteHandler('admin'), adminController.changePassword);
router.post('/admin/changeEmail', RouteHandler('admin'), adminController.changeEmail);

let agentController = require('../controllers/Agent');
router.get('/agents', RouteHandler('admin'), agentController.getAll);
router.post('/agents/apply', RouteHandler('user'), agentController.create);
router.post('/agents/approve', RouteHandler('admin'), agentController.approve);
router.post('/agents/decline', RouteHandler('admin'), agentController.decline);

let bankController = require('../controllers/Bank');
router.get('/bank', RouteHandler('admin'), bankController.getAll);
router.post('/bank', RouteHandler('admin'), bankController.create);

let businessController = require('../controllers/Business');
router.get('/business', RouteHandler('admin'), businessController.getAll);
router.post('/business', RouteHandler(), businessController.register);
router.get('/business/registrationInformation', RouteHandler('admin'), businessController.registrationInformation);
router.post('/business/approve', RouteHandler('admin'), businessController.approve);
router.post('/business/decline', RouteHandler('admin'), businessController.decline);
router.post('/business/info', RouteHandler('admin'), businessController.updateInfo);
router.get('/business/getTypes', RouteHandler('admin'), businessController.getTypes);

let businessCategoryController = require('../controllers/BusinessCategory');
router.get('/business_category', RouteHandler('admin'), businessCategoryController.getAll);
router.post('/business_category', RouteHandler('admin'), businessCategoryController.create);
router.post('/business_category/business', RouteHandler('admin'), businessCategoryController.get);

let businessTypeController = require('../controllers/BusinessType');
router.get('/business_type', RouteHandler('admin'), businessTypeController.getAll);
router.post('/business_type', RouteHandler('admin'), businessTypeController.create);

let currencyController = require('../controllers/Currency');
router.get('/currency', RouteHandler('admin'), currencyController.getAll);
router.post('/currency', RouteHandler('admin'), currencyController.create);
router.post('/currency/convert', RouteHandler(), currencyController.convert);

let feedbackController = require('../controllers/Feedback');
router.get('/feedbacks', RouteHandler('admin'), feedbackController.getAll);
router.post('/feedbacks', RouteHandler('admin'), feedbackController.create);

let itemController = require('../controllers/Item');
router.post('/item/add', RouteHandler('admin'), itemController.add);
router.post('/item/remove', RouteHandler('admin'), itemController.remove);
router.post('/item/business', RouteHandler('admin'), itemController.business);

let merchantController = require('../controllers/Merchant');
router.get('/merchants', RouteHandler('admin'), merchantController.getAll);
router.post('/merchants/id', RouteHandler('admin'), merchantController.getById);
router.post('/merchants', RouteHandler(), merchantController.register);
router.post('/merchants/login', RouteHandler(), merchantController.login);
router.post('/merchants/tempPassword', RouteHandler('admin'), merchantController.createTempPassword);
router.post('/merchants/resetPassword', RouteHandler('admin'), merchantController.resetPassword);
router.post('/merchants/updatePush', RouteHandler('admin'), merchantController.updatePushToken);
router.post('/merchants/removePush', RouteHandler('admin'), merchantController.removePushToken);

let paymentMethodController = require('../controllers/PaymentMethod');
router.post('/payment_method/', RouteHandler('admin'), paymentMethodController.create);
router.get('/payment_method/', RouteHandler('admin'), paymentMethodController.getAll);

let pushController = require('../controllers/Push');
router.get('/push', RouteHandler('admin'), pushController.getAll);
router.post('/push', RouteHandler('admin'), pushController.create);

let staticController = require('../controllers/Static');
router.get('/static', RouteHandler('admin'), staticController.getAll);
router.post('/static/faq', RouteHandler('admin'), staticController.editFaq);
router.post('/static/policies', RouteHandler('admin'), staticController.editPolicies);

let transactionController = require('../controllers/Transaction');
router.get('/transaction/:user_type', RouteHandler('admin'), transactionController.getAllTransactions);
router.post('/transaction/:user_type', RouteHandler('admin'), transactionController.createTransaction);

let userController = require('../controllers/User');
router.get('/users', RouteHandler('admin'), userController.getAll);
router.post('/users/id', RouteHandler('admin'), userController.getById);
router.post('/users', RouteHandler(), userController.register);
router.post('/users/login', RouteHandler(), userController.login);
router.post('/users/tempPassword', RouteHandler(), userController.createTempPassword);
router.post('/users/resetPassword', RouteHandler('user'), userController.resetPassword);
router.post('/users/updatePush', RouteHandler('admin'), userController.updatePushToken);
router.post('/users/removePush', RouteHandler('admin'), userController.removePushToken);
router.get('/users/me', RouteHandler('user'), userController.verify);

let voletController = require('../controllers/Volet');
router.get('/volet', RouteHandler('admin'), voletController.getAll);
router.post('/volet', RouteHandler('admin'), voletController.create);
router.post('/volet/id', RouteHandler('admin'), voletController.calculate);

let voucherController = require('../controllers/Voucher');
router.get('/vouchers', RouteHandler('admin'), voucherController.getAll);
router.post('/vouchers', RouteHandler('admin'), voucherController.create);
router.post('/vouchers/redeem', RouteHandler('admin'), voucherController.redeem);

let toggleController = require('../controllers/Toggle');
router.post('/bank/toggle', RouteHandler('admin'), toggleController.bank);
router.post('/business_category/toggle', RouteHandler('admin'), toggleController.businessCategory);
router.post('/business_type/toggle', RouteHandler('admin'), toggleController.businessType);
router.post('/currency/toggle', RouteHandler('admin'), toggleController.currency);
router.post('/payment_method/toggle', RouteHandler('admin'), toggleController.paymentMethod);

let paymentController = require('../controllers/Payment');
router.post('/payment', RouteHandler('user'), paymentController.create);
router.post('/payment/billplz', RouteHandler(), paymentController.billplz_payment);


module.exports = router;