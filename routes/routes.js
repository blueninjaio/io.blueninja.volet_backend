let express = require('express');
let route = require('../middlewares/route');
let express_router = express.Router();
let router = {
    get: (path, auth, ...callback) => {
        if (typeof auth == 'string' || Array.isArray(auth)) {
            express_router.get(path, route.handler, route.auth(auth), ...callback);
        } else {
            express_router.get(path, route.handler, auth, ...callback);
        }
    },
    post: (path, auth, ...callback) => {
        if (typeof auth == 'string' || Array.isArray(auth)) {
            express_router.post(path, route.handler, route.auth(auth), ...callback);
        } else {
            express_router.post(path, route.handler, auth, ...callback);
        }
    }
};

let controller;
controller = require('../controllers/Admin');
router.get ('/admin',                ['admin'], controller.getAll);
router.post('/admin',                ['admin'], controller.create);
router.post('/admin/login',                           controller.login);
router.get ('/admin/me',             ['admin'], controller.verifyUser);
router.post('/admin/changePassword', ['admin'], controller.changePassword);
router.post('/admin/changeEmail',    ['admin'], controller.changeEmail);

controller = require('../controllers/Agent');
router.get ('/agents',         ['admin'], controller.getAll);
router.post('/agents/apply',   ['user'],  controller.create);
router.post('/agents/approve', ['admin'], controller.approve);
router.post('/agents/decline', ['admin'], controller.decline);

controller = require('../controllers/Bank');
router.get ('/bank', ['admin'], controller.getAll);
router.post('/bank', ['admin'], controller.create);

controller = require('../controllers/Business');
router.get ('/business',                         ['admin'], controller.getAll);
router.post('/business',                                          controller.register);
router.get ('/business/registrationInformation', ['admin'], controller.registrationInformation);
router.post('/business/approve',                 ['admin'], controller.approve);
router.post('/business/decline',                 ['admin'], controller.decline);
router.post('/business/info',                    ['admin'], controller.updateInfo);
router.get ('/business/getTypes',                ['admin'], controller.getTypes);

controller = require('../controllers/BusinessCategory');
router.get ('/business_category',          ['admin'], controller.getAll);
router.post('/business_category',          ['admin'], controller.create);
router.post('/business_category/business', ['admin'], controller.get);

controller = require('../controllers/BusinessType');
router.get ('/business_type', ['admin'], controller.getAll);
router.post('/business_type', ['admin'], controller.create);

controller = require('../controllers/Currency');
router.get ('/currency', ['admin'], controller.getAll);
router.post('/currency', ['admin'], controller.create);
router.post('/currency/convert',          controller.convert);

controller = require('../controllers/Feedback');
router.get ('/feedbacks', ['admin'], controller.getAll);
router.post('/feedbacks', ['admin'], controller.create);

controller = require('../controllers/Item');
router.post('/item/add',      ['admin'], controller.add);
router.post('/item/remove',   ['admin'], controller.remove);
router.post('/item/business', ['admin'], controller.business);

controller = require('../controllers/Merchant');
router.get ('/merchants',               ['admin'], controller.getAll);
router.post('/merchants/id',            ['admin'], controller.getById);
router.post('/merchants',                                controller.register);
router.post('/merchants/login',                          controller.login);
router.post('/merchants/tempPassword',  ['admin'], controller.createTempPassword);
router.post('/merchants/resetPassword', ['admin'], controller.resetPassword);
router.post('/merchants/updatePush',    ['admin'], controller.updatePushToken);
router.post('/merchants/removePush',    ['admin'], controller.removePushToken);

controller = require('../controllers/PaymentMethod');
router.post('/payment_method/', ['admin'], controller.create);
router.get ('/payment_method/', ['admin'], controller.getAll);

controller = require('../controllers/Push');
router.get ('/push', ['admin'], controller.getAll);
router.post('/push', ['admin'], controller.create);

controller = require('../controllers/Static');
router.get ('/static',          ['admin'], controller.getAll);
router.post('/static/faq',      ['admin'], controller.editFaq);
router.post('/static/policies', ['admin'], controller.editPolicies);

controller = require('../controllers/Transaction');
router.get ('/transaction/:user_type', ['admin'], controller.getAllTransactions);
router.post('/transaction/:user_type', ['admin'], controller.createTransaction);

controller = require('../controllers/User');
router.get ('/users',                ['admin'],                       controller.getAll);
router.post('/users/id',             ['admin'],                       controller.getById);
router.post('/users',                                route.tac(0), controller.register);
router.post('/users/login',                                                 controller.login);
router.post('/users/forget-password',                route.tac(1), controller.forgetPassword);
router.post('/users/reset-password', ['user'], route.tac(2), controller.resetPassword);
router.post('/users/updatePush',     ['admin'],                       controller.updatePushToken);
router.post('/users/removePush',     ['admin'],                       controller.removePushToken);
router.get ('/users/me',             ['user'],                        controller.verify);

controller = require('../controllers/TAC');
router.post('/tac',            controller.send);
router.post('/check-tac',      controller.check);

controller = require('../controllers/Volet');
router.get ('/volet',    ['admin'], controller.getAll);
router.post('/volet',    ['admin'], controller.create);
router.post('/volet/id', ['admin'], controller.calculate);

controller = require('../controllers/Voucher');
router.get ('/vouchers',        ['admin'], controller.getAll);
router.post('/vouchers',        ['admin'], controller.create);
router.post('/vouchers/redeem', ['admin'], controller.redeem);

controller = require('../controllers/Toggle');
router.post('/bank/toggle',              ['admin'], controller.bank);
router.post('/business_category/toggle', ['admin'], controller.businessCategory);
router.post('/business_type/toggle',     ['admin'], controller.businessType);
router.post('/currency/toggle',          ['admin'], controller.currency);
router.post('/payment_method/toggle',    ['admin'], controller.paymentMethod);

controller = require('../controllers/Payment');
router.post('/payment', ['user'], controller.create);
router.post('/payment/billplz',         controller.billplz_payment);


module.exports = express_router;