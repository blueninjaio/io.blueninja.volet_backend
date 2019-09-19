const express = require('express');
const router = express.Router();
const multer = require('multer');

const { getAdmins, createAdmin, loginAdmin, verifyAdmin, changeAdminPassword, changeAdminEmail } = require("./admin");
const { getBanks, getActiveBanks, createBank } = require("./bank");
const { getBusinesses, registerBusiness, getBusinessRegistrationInformation, approveBusiness, declineBusiness, updateBusinessInfo, getBusinessTypes2 } = require("./business");
const { getBusinessCategories, createBusinessCategory, getBusinessCategory } = require("./business-category");
const { getBusinessTypes, createBusinessType } = require("./business-type");
const { getCurrencies, createCurrency, convertCurrency } = require("./currency");
const { getFeedback, createFeedback } = require("./feedback");
const { addItem, removeItem, getBusinessItems } = require("./item");
const { getPush, createPush } = require("./push");
const { getStaticPages, editFaq, editPolicies } = require("./static-page");
const { getTransactions, createTransaction } = require("./transaction");
const { getUsers, registerUser, loginUser, forgetUserPassword, resetUserPassword, getUserById, getUserInfo, updateCoordinates, addBank, editSavingsPlan, getUsersByMobile, editUserInfo, applyAgent, getUserAgents, toggleAgent, clearNotifications } = require("./user");
const { sendNewTAC, sendExistingTAC, sendUserTAC, checkTAC, checkUserTAC } = require("./tac");
const { getVouchers, createVoucher, redeemVoucher, getVoucherById } = require("./voucher");
const { toggleBank, toggleBusinessCategory, toggleBusinessType, toggleCurrency } = require("./toggle");
const { callbackBillplz } = require("./billplz");
const { getPayments, sendPayment, requestPayment, topUpVolet, withdrawFromAgent, acceptWithdrawal, rejectWithdrawal } = require("./volet");

const { newTAC, existingTAC, userTAC } = require('../tac');
const { adminAuth, userAuth, merchantAuth, anyAuth } = require('../auth');

const catchAsyncErrors = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((e) => {
            next(e);
        });
    };
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req))
        .then(object => {
            res.ok(object);
        })
        .catch((e) => {
            next(e);
        });
    };
};
let upload = multer({ dest: 'images/' });
let imageUpload = upload.single('image');

router.get('/admin', adminAuth, catchAsyncErrors(getAdmins));
router.post('/admin', adminAuth, catchAsyncErrors(createAdmin));
router.post('/admin/login', catchAsyncErrors(loginAdmin));
router.get('/admin/me', adminAuth, catchAsyncErrors(verifyAdmin));
router.post('/admin/changePassword', adminAuth, catchAsyncErrors(changeAdminPassword));
router.post('/admin/changeEmail', adminAuth, catchAsyncErrors(changeAdminEmail));

router.get('/bank', adminAuth, catchAsyncErrors(getBanks));
router.post('/bank', adminAuth, catchAsyncErrors(createBank));
router.get('/bank/active', anyAuth, catchAsyncErrors(getActiveBanks));

router.get('/business', adminAuth, catchAsyncErrors(getBusinesses));
router.post('/business', catchAsyncErrors(registerBusiness));
router.get('/business/registrationInformation', adminAuth, catchAsyncErrors(getBusinessRegistrationInformation));
router.post('/business/approve', adminAuth, catchAsyncErrors(approveBusiness));
router.post('/business/decline', adminAuth, catchAsyncErrors(declineBusiness));
router.post('/business/info', adminAuth, catchAsyncErrors(updateBusinessInfo));
router.get('/business/getTypes', adminAuth, catchAsyncErrors(getBusinessTypes2));

router.get('/business_category', adminAuth, catchAsyncErrors(getBusinessCategories));
router.post('/business_category', adminAuth, catchAsyncErrors(createBusinessCategory));
router.post('/business_category/business', adminAuth, catchAsyncErrors(getBusinessCategory));

router.get('/business_type', adminAuth, catchAsyncErrors(getBusinessTypes));
router.post('/business_type', adminAuth, catchAsyncErrors(createBusinessType));

router.get('/currency', adminAuth, catchAsyncErrors(getCurrencies));
router.post('/currency', adminAuth, catchAsyncErrors(createCurrency));
router.post('/currency/convert', catchAsyncErrors(convertCurrency));

router.get('/feedback', adminAuth, catchAsyncErrors(getFeedback));
router.post('/feedback', userAuth, catchAsyncErrors(createFeedback));

router.post('/item/add', adminAuth, catchAsyncErrors(addItem));
router.post('/item/remove', adminAuth, catchAsyncErrors(removeItem));
router.post('/item/business', adminAuth, catchAsyncErrors(getBusinessItems));

router.get('/push', adminAuth, catchAsyncErrors(getPush));
router.post('/push', adminAuth, catchAsyncErrors(createPush));

router.get('/static', adminAuth, catchAsyncErrors(getStaticPages));
router.post('/static/faq', adminAuth, catchAsyncErrors(editFaq));
router.post('/static/policies', adminAuth, catchAsyncErrors(editPolicies));

router.get('/transaction/:user_type', adminAuth, catchAsyncErrors(getTransactions));

router.get('/users', adminAuth, catchAsyncErrors(getUsers));
router.post('/users', newTAC, catchAsyncErrors(registerUser));
router.post('/users/login', catchAsyncErrors(loginUser));
router.post('/users/forget-password', existingTAC, catchAsyncErrors(forgetUserPassword));
router.post('/users/reset-password', userAuth, userTAC, catchAsyncErrors(resetUserPassword));
router.get('/users/me', userAuth, catchAsyncErrors(getUserInfo));
router.post('/users/edit', userAuth, imageUpload, catchAsyncErrors(editUserInfo));
router.post('/users/edit-savings', userAuth, catchAsyncErrors(editSavingsPlan));//done
router.post('/users/add-bank', userAuth, catchAsyncErrors(addBank));
router.post('/users/get-by-contact', userAuth, catchAsyncErrors(getUsersByMobile));
router.get('/users/agents', userAuth, catchAsyncErrors(getUserAgents));//done

router.post('/users/agents/apply', userAuth, catchAsyncErrors(applyAgent));//done
//router.post('/users/agent/accept',       userAuth,                  catchAsyncErrors(applyAgent));
//router.post('/users/agent/decline',       userAuth,                 catchAsyncErrors(applyAgent));
router.post('/users/agents/visibility', userAuth, catchAsyncErrors(toggleAgent));//done

router.post('/users/notifications/clear',           userAuth,               catchAsyncErrors(clearNotifications));
router.post('/users/coordinates', userAuth, catchAsyncErrors(updateCoordinates));//done

router.get('/users/:id', userAuth, catchAsyncErrors(getUserById));

router.post('/volet/top-up', userAuth, catchAsyncErrors(topUpVolet));
router.get('/volet/payments', userAuth, catchAsyncErrors(getPayments));
router.post('/volet/payments/send', userAuth, catchAsyncErrors(sendPayment));
router.post('/volet/payments/request', userAuth, catchAsyncErrors(requestPayment));
//todo accept request
router.post('/volet/withdraw/agent', userAuth, catchAsyncErrors(withdrawFromAgent));
//router.post('/volet/withdraw/bank',          userAuth,               catchAsyncErrors(withdrawFromAgent));
router.post('/volet/withdraw/accept', userAuth, catchAsyncErrors(acceptWithdrawal));
router.post('/volet/withdraw/reject', userAuth, catchAsyncErrors(rejectWithdrawal));

router.post('/tac/new', catchAsyncErrors(sendNewTAC));
router.post('/tac/contact', catchAsyncErrors(sendExistingTAC));
router.post('/tac/user', userAuth, catchAsyncErrors(sendUserTAC));
router.post('/tac/check', catchAsyncErrors(checkTAC));
router.post('/tac/check-user', userAuth, catchAsyncErrors(checkUserTAC));

router.get('/vouchers', adminAuth, catchAsyncErrors(getVouchers));
router.post('/vouchers', adminAuth, catchAsyncErrors(createVoucher));
router.post('/vouchers/redeem', userAuth, catchAsyncErrors(redeemVoucher));//done
router.get('/vouchers/:id', userAuth, catchAsyncErrors(getVoucherById));//done

router.post('/bank/toggle', adminAuth, catchAsyncErrors(toggleBank));
router.post('/business_category/toggle', adminAuth, catchAsyncErrors(toggleBusinessCategory));
router.post('/business_type/toggle', adminAuth, catchAsyncErrors(toggleBusinessType));
router.post('/currency/toggle', adminAuth, catchAsyncErrors(toggleCurrency));

router.post('/billplz', catchAsyncErrors(callbackBillplz));


module.exports = router;