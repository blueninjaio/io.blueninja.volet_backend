let express = require('express');
let router = express.Router();

let adminController = require('../controllers/Admin');
router.get('/admin', adminController.getAll);
router.post('/admin', adminController.create);
router.post('/admin/login', adminController.login);
router.post('/admin/me', adminController.verifyUser);
router.post('/admin/forgotPassword', adminController.forgotPassword);
router.post('/admin/changePassword', adminController.changePassword);
router.post('/admin/changeEmail', adminController.changeEmail);

let agentController = require('../controllers/Agent');
router.get('/agents', agentController.getAll);
router.post('/agents', agentController.create);
router.post('/agents/approve', agentController.approve);
router.post('/agents/decline', agentController.decline);

let bankController = require('../controllers/Bank');
router.get('/bank', bankController.getAll);
router.post('/bank', bankController.create);
router.post('/bank/toggle', bankController.toggle);

let businessController = require('../controllers/Business');
router.get('/business', businessController.getAll);
router.post('/business', businessController.register);
router.get('/business/registrationInformation', businessController.registrationInformation);
router.post('/business/approve', businessController.approve);
router.post('/business/decline', businessController.decline);
router.post('/business/info', businessController.updateInfo);

let businessCategoryController = require('../controllers/BusinessCategory');
router.get('/business_category', businessCategoryController.getAll);
router.post('/business_category/business', businessCategoryController.get);
router.post('/business_category', businessCategoryController.create);
router.post('/business_category/toggle', businessCategoryController.toggle);

let businessTypeController = require('../controllers/BusinessType');
router.get('/business_type', businessTypeController.getAll);
router.post('/business_type', businessTypeController.create);
router.post('/business_type/toggle', businessTypeController.toggle);

let currencyController = require('../controllers/Currency');
router.post('/currency', currencyController.create);
router.get('/currency', currencyController.getAll);
router.post('/currency/toggle', currencyController.toggle);

let feedbackController = require('../controllers/Feedback');
router.get('/feedbacks', feedbackController.getAll);
router.post('/feedbacks', feedbackController.create);

let itemController = require('../controllers/Item');
router.post('/item/add', itemController.add);
router.post('/item/remove', itemController.remove);
router.post('/item/business', itemController.business);

let merchantController = require('../controllers/Merchant');
router.get('/merchants', merchantController.getAll);
router.post('/merchants/id', merchantController.getById);
router.post('/merchants', merchantController.register);
router.post('/merchants/login', merchantController.login);
router.post('/merchants/tempPassword', merchantController.createTempPassword);
router.post('/merchants/resetPassword', merchantController.resetPassword);
router.post('/merchants/updatePush', merchantController.updatePushToken);
router.post('/merchants/removePush', merchantController.removePushToken);

let paymentMethodController = require('../controllers/PaymentMethod');
router.post('/payment_method/', paymentMethodController.create);
router.get('/payment_method/', paymentMethodController.getAll);
router.post('/payment_method/toggle', paymentMethodController.toggle);

let pushController = require('../controllers/Push');
router.get('/push', pushController.getAll);
router.post('/push', pushController.create);

let staticController = require('../controllers/Static');
router.get('/static', staticController.getAll);
router.post('/static/faq', staticController.editFaq);
router.post('/static/policies', staticController.editPolicies);

let userController = require('../controllers/User');
router.get('/users', userController.getAll);
router.post('/users/id', userController.getById);
router.post('/users', userController.register);
router.post('/users/login', userController.login);
router.post('/users/tempPassword', userController.createTempPassword);
router.post('/users/resetPassword', userController.resetPassword);
router.post('/users/updatePush', userController.updatePushToken);
router.post('/users/removePush', userController.removePushToken);
router.post('/users/me', userController.verify);

let voletController = require('../controllers/Volet');
router.get('/volet', voletController.getAll);
router.post('/volet', voletController.create);
router.post('/volet/id', voletController.calculate);

let voucherController = require('../controllers/Voucher');
router.post('/', voucherController.getAll);
router.post('/redeem', voucherController.redeem);
router.get('/', voucherController.redeem);

module.exports = router;