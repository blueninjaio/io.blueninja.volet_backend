const express = require('express');
const router = express.Router();
const multer = require('multer');
const HttpStatus = require("http-status-codes");

const { getAdmins, createAdmin, loginAdmin, verifyAdmin, changeAdminPassword, changeAdminEmail } = require("../../controllers/admin");
const { getBanks, getActiveBanks, createBank } = require("../../controllers/bank");
const { getBusinesses, registerBusiness, getBusinessRegistrationInformation, approveBusiness, declineBusiness, updateBusinessInfo, getBusinessTypes2 } = require("../../controllers/business");
const { getBusinessCategories, createBusinessCategory, getBusinessCategory } = require("../../controllers/business-category");
const { getBusinessTypes, createBusinessType } = require("../../controllers/business-type");
const { getCurrencies, createCurrency, convertCurrency } = require("../../controllers/currency");
const { getFeedback, createFeedback } = require("../../controllers/feedback");
const { addItem, removeItem, getBusinessItems } = require("../../controllers/item");
const { getPush, createPush } = require("../../controllers/push");
const { getStaticPages, editFaq, editPolicies } = require("../../controllers/static-page");
const { getTransactions, createTransaction } = require("../../controllers/transaction");
const { getUsers, registerUser, loginUser, forgetUserPassword, resetUserPassword, getUserById, getUserInfo, updateCoordinates, addBank, editSavingsPlan, getUsersByMobile, editUserInfo, applyAgent, getUserAgents, toggleAgent, clearNotifications } = require("../../controllers/user");
const { sendNewTAC, sendExistingTAC, sendUserTAC, checkTAC, checkUserTAC } = require("../../controllers/tac");
const { getVouchers, createVoucher, redeemVoucher, getVoucherById } = require("../../controllers/voucher");
const { toggleBank, toggleBusinessCategory, toggleBusinessType, toggleCurrency } = require("../../controllers/toggle");
const { callbackBillplz } = require("../../controllers/billplz");
const { getPayments, sendPayment, requestPayment, topUpVolet, withdrawFromAgent, acceptWithdrawal, rejectWithdrawal } = require("../../controllers/volet");
const { RouteError } = require("../../errors");

const { newTAC, existingTAC, userTAC } = require('../tac');
const { adminAuth, userAuth, anyAuth } = require('../auth');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req))
        .then(object => {
            res.response(200, undefined, object);
        })
        .catch((e) => {
            next(e);
        });
    };
};

router.use((req, res, next) => {
    res.response = (code, message, object) => {
        return res.status(code).send(Object.assign({
            message: message,
            success: code === HttpStatus.OK
        }, object));
    };
    next();
});
let upload = multer({ dest: 'images/' });
//let imageUpload = upload.single('image');

router.get('/admin', adminAuth, asyncHandler(getAdmins));
router.post('/admin', adminAuth, asyncHandler(createAdmin));
router.post('/admin/login', asyncHandler(loginAdmin));
router.get('/admin/me', adminAuth, asyncHandler(verifyAdmin));
router.post('/admin/changePassword', adminAuth, asyncHandler(changeAdminPassword));
router.post('/admin/changeEmail', adminAuth, asyncHandler(changeAdminEmail));

router.get('/bank', adminAuth, asyncHandler(getBanks));
router.post('/bank', adminAuth, asyncHandler(createBank));
router.get('/bank/active', anyAuth, asyncHandler(getActiveBanks));

router.get('/business', adminAuth, asyncHandler(getBusinesses));
router.post('/business', asyncHandler(registerBusiness));
router.get('/business/registrationInformation', adminAuth, asyncHandler(getBusinessRegistrationInformation));
router.post('/business/approve', adminAuth, asyncHandler(approveBusiness));
router.post('/business/decline', adminAuth, asyncHandler(declineBusiness));
router.post('/business/info', adminAuth, asyncHandler(updateBusinessInfo));
router.get('/business/getTypes', adminAuth, asyncHandler(getBusinessTypes2));

router.get('/business_category', adminAuth, asyncHandler(getBusinessCategories));
router.post('/business_category', adminAuth, asyncHandler(createBusinessCategory));
router.post('/business_category/business', adminAuth, asyncHandler(getBusinessCategory));

router.get('/business_type', adminAuth, asyncHandler(getBusinessTypes));
router.post('/business_type', adminAuth, asyncHandler(createBusinessType));

router.get('/currency', adminAuth, asyncHandler(getCurrencies));
router.post('/currency', adminAuth, asyncHandler(createCurrency));
router.post('/currency/convert', asyncHandler(convertCurrency));

router.get('/feedback', adminAuth, asyncHandler(getFeedback));
router.post('/feedback', userAuth, asyncHandler(createFeedback));

router.post('/item/add', adminAuth, asyncHandler(addItem));
router.post('/item/remove', adminAuth, asyncHandler(removeItem));
router.post('/item/business', adminAuth, asyncHandler(getBusinessItems));

router.get('/push', adminAuth, asyncHandler(getPush));
router.post('/push', adminAuth, asyncHandler(createPush));

router.get('/static', adminAuth, asyncHandler(getStaticPages));
router.post('/static/faq', adminAuth, asyncHandler(editFaq));
router.post('/static/policies', adminAuth, asyncHandler(editPolicies));

router.get('/transaction/:user_type', adminAuth, asyncHandler(getTransactions));

router.get('/users', adminAuth, asyncHandler(getUsers));
router.post('/users', newTAC, asyncHandler(registerUser));
router.post('/users/login', asyncHandler(loginUser));
router.post('/users/forget-password', existingTAC, asyncHandler(forgetUserPassword));
router.post('/users/reset-password', userAuth, userTAC, asyncHandler(resetUserPassword));
router.get('/users/me', userAuth, asyncHandler(getUserInfo));
router.post('/users/edit', userAuth, asyncHandler(editUserInfo));
router.post('/users/edit-savings', userAuth, asyncHandler(editSavingsPlan));//done
router.post('/users/add-bank', userAuth, asyncHandler(addBank));
router.post('/users/get-by-contact', userAuth, asyncHandler(getUsersByMobile));
router.get('/users/agents', userAuth, asyncHandler(getUserAgents));//done

router.post('/users/agents/apply', userAuth, asyncHandler(applyAgent));//done
//router.post('/users/agent/accept',       userAuth,                  asyncHandler(applyAgent));
//router.post('/users/agent/decline',       userAuth,                 asyncHandler(applyAgent));
router.post('/users/agents/visibility', userAuth, asyncHandler(toggleAgent));//done

router.post('/users/notifications/clear',           userAuth,               asyncHandler(clearNotifications));
router.post('/users/coordinates', userAuth, asyncHandler(updateCoordinates));//done

router.get('/users/:id', userAuth, asyncHandler(getUserById));

router.post('/volet/top-up', userAuth, asyncHandler(topUpVolet));
router.get('/volet/payments', userAuth, asyncHandler(getPayments));
router.post('/volet/payments/send', userAuth, asyncHandler(sendPayment));
router.post('/volet/payments/request', userAuth, asyncHandler(requestPayment));
//todo accept request
router.post('/volet/withdraw/agent', userAuth, asyncHandler(withdrawFromAgent));
//router.post('/volet/withdraw/bank',          userAuth,               asyncHandler(withdrawFromAgent));
router.post('/volet/withdraw/accept', userAuth, asyncHandler(acceptWithdrawal));
router.post('/volet/withdraw/reject', userAuth, asyncHandler(rejectWithdrawal));

router.post('/tac/new', asyncHandler(sendNewTAC));
router.post('/tac/contact', asyncHandler(sendExistingTAC));
router.post('/tac/user', userAuth, asyncHandler(sendUserTAC));
router.post('/tac/check', asyncHandler(checkTAC));
router.post('/tac/check-user', userAuth, asyncHandler(checkUserTAC));

router.get('/vouchers', adminAuth, asyncHandler(getVouchers));
router.post('/vouchers', adminAuth, asyncHandler(createVoucher));
router.post('/vouchers/redeem', userAuth, asyncHandler(redeemVoucher));//done
router.get('/vouchers/:id', userAuth, asyncHandler(getVoucherById));//done

router.post('/bank/toggle', adminAuth, asyncHandler(toggleBank));
router.post('/business_category/toggle', adminAuth, asyncHandler(toggleBusinessCategory));
router.post('/business_type/toggle', adminAuth, asyncHandler(toggleBusinessType));
router.post('/currency/toggle', adminAuth, asyncHandler(toggleCurrency));

router.post('/billplz', asyncHandler(callbackBillplz));


router.use(function (err, req, res, next) {
    if (err instanceof RouteError) {
        return res.status(err.statusCode).send({
            message: err.message,
            success: false
        });
    }
    next(err);
});
module.exports = router;