const express = require('express');
const tac = require('../middlewares/tac');
const auth = require('../middlewares/auth');
const async = require('../middlewares/async');
const express_router = express.Router();
const convertHandlers = (handlers) => {
    for (let i = 0; i < handlers.length; i++) {
        let handler = handlers[i];
        if (handler[Symbol.toStringTag] === 'AsyncFunction') {
            handlers[i] = async(handler);
        }
    }
    return handlers;
};
const router = {
    get: (path, ...callback) => {
        express_router.get(path, convertHandlers(callback));
    },
    post: (path, ...callback) => {
        express_router.post(path, convertHandlers(callback));
    }
};

let controller;
controller = require('../controllers/Admin');
router.get ('/admin',                auth.admin, controller.getAll);
router.post('/admin',                auth.admin, controller.create);
router.post('/admin/login',                      controller.login);
router.get ('/admin/me',             auth.admin, controller.verifyUser);
router.post('/admin/changePassword', auth.admin, controller.changePassword);
router.post('/admin/changeEmail',    auth.admin, controller.changeEmail);

controller = require('../controllers/Agent');
router.get ('/agents',         auth.admin, controller.getAll);
router.post('/agents/apply',   auth.user,  controller.create);
router.post('/agents/approve', auth.admin, controller.approve);
router.post('/agents/decline', auth.admin, controller.decline);

controller = require('../controllers/Bank');
router.get ('/bank', auth.admin, controller.getAll);
router.post('/bank', auth.admin, controller.create);

controller = require('../controllers/Business');
router.get ('/business',                         auth.admin, controller.getAll);
router.post('/business',                                     controller.register);
router.get ('/business/registrationInformation', auth.admin, controller.registrationInformation);
router.post('/business/approve',                 auth.admin, controller.approve);
router.post('/business/decline',                 auth.admin, controller.decline);
router.post('/business/info',                    auth.admin, controller.updateInfo);
router.get ('/business/getTypes',                auth.admin, controller.getTypes);

controller = require('../controllers/BusinessCategory');
router.get ('/business_category',          auth.admin, controller.getAll);
router.post('/business_category',          auth.admin, controller.create);
router.post('/business_category/business', auth.admin, controller.get);

controller = require('../controllers/BusinessType');
router.get ('/business_type', auth.admin, controller.getAll);
router.post('/business_type', auth.admin, controller.create);

controller = require('../controllers/Currency');
router.get ('/currency', auth.admin, controller.getAll);
router.post('/currency', auth.admin, controller.create);
router.post('/currency/convert',     controller.convert);

controller = require('../controllers/Feedback');
router.get ('/feedbacks', auth.admin, controller.getAll);
router.post('/feedbacks', auth.admin, controller.create);

controller = require('../controllers/Item');
router.post('/item/add',      auth.admin, controller.add);
router.post('/item/remove',   auth.admin, controller.remove);
router.post('/item/business', auth.admin, controller.business);

controller = require('../controllers/Merchant');
router.get ('/merchants',               auth.admin, controller.getAll);
router.post('/merchants/id',            auth.admin, controller.getById);
router.post('/merchants',                           controller.register);
router.post('/merchants/login',                     controller.login);
router.post('/merchants/tempPassword',  auth.admin, controller.createTempPassword);
router.post('/merchants/resetPassword', auth.admin, controller.resetPassword);
router.post('/merchants/updatePush',    auth.admin, controller.updatePushToken);
router.post('/merchants/removePush',    auth.admin, controller.removePushToken);

controller = require('../controllers/PaymentMethod');
router.post('/payment_method/', auth.admin, controller.create);
router.get ('/payment_method/', auth.admin, controller.getAll);

controller = require('../controllers/Push');
router.get ('/push', auth.admin, controller.getAll);
router.post('/push', auth.admin, controller.create);

controller = require('../controllers/Static');
router.get ('/static',          auth.admin, controller.getAll);
router.post('/static/faq',      auth.admin, controller.editFaq);
router.post('/static/policies', auth.admin, controller.editPolicies);

controller = require('../controllers/Transaction');
router.get ('/transaction/:user_type', auth.admin, controller.getAllTransactions);
router.post('/transaction/:user_type', auth.admin, controller.createTransaction);

controller = require('../controllers/User');
router.get ('/users',                auth.admin,                     controller.getAll);
router.post('/users/id',             auth.admin,                     controller.getById);
router.post('/users',                            tac.register,       controller.register);
router.post('/users/login',                                          controller.login);
router.post('/users/forget-password',            tac.forgetPassword, controller.forgetPassword);
router.post('/users/reset-password', auth.user,  tac.resetPassword,  controller.resetPassword);
router.post('/users/updatePush',     auth.admin,                     controller.updatePushToken);
router.post('/users/removePush',     auth.admin,                     controller.removePushToken);
router.get ('/users/me',             auth.user,                      controller.verify);

controller = require('../controllers/TAC');
router.post('/tac/0',      controller.send);
router.post('/tac/1',      controller.send);
router.post('/tac/2',      controller.send);
router.post('/check-tac', controller.check);

controller = require('../controllers/Volet');
router.get ('/volet',    auth.admin, controller.getAll);
router.post('/volet',    auth.admin, controller.create);
router.post('/volet/id', auth.admin, controller.calculate);

controller = require('../controllers/Voucher');
router.get ('/vouchers',        auth.admin, controller.getAll);
router.post('/vouchers',        auth.admin, controller.create);
router.post('/vouchers/redeem', auth.admin, controller.redeem);

controller = require('../controllers/Toggle');
router.post('/bank/toggle',              auth.admin, controller.bank);
router.post('/business_category/toggle', auth.admin, controller.businessCategory);
router.post('/business_type/toggle',     auth.admin, controller.businessType);
router.post('/currency/toggle',          auth.admin, controller.currency);
router.post('/payment_method/toggle',    auth.admin, controller.paymentMethod);

controller = require('../controllers/Payment');
router.post('/payment',         auth.user,      controller.create);
router.post('/payment/billplz',         controller.billplz_payment);


module.exports = express_router;