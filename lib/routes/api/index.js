const express = require('express');
const router = express.Router();
const multer = require('multer');

const { getAdmins, createAdmin, loginAdmin, verifyAdmin, changeAdminPassword, changeAdminEmail } = require("./admin");
const { getAgents, createAgent, approveAgent, declineAgent } = require("./agent");
const { getBanks, getActiveBanks, createBank } = require("./bank");
const { getBusinesses, registerBusiness, getBusinessRegistrationInformation, approveBusiness, declineBusiness, updateBusinessInfo, getBusinessTypes2 } = require("./business");
const { getBusinessCategories, createBusinessCategory, getBusinessCategory } = require("./business-category");
const { getBusinessTypes, createBusinessType } = require("./business-type");
const { getCurrencies, createCurrency, convertCurrency } = require("./currency");
const { getFeedback, createFeedback } = require("./feedback");
const { addItem, removeItem, getBusinessItems } = require("./item");
const { getMerchants, getMerchantById, registerMerchant, loginMerchant, createMerchantTempPassword, resetMerchantPassword, updateMerchantPushToken, removeMerchantPushToken } = require("./merchant");
const { getPaymentMethods, createPaymentMethod } = require("./payment-method");
const { getPush, createPush } = require("./push");
const { getStaticPages, editFaq, editPolicies } = require("./static");
const { getTransactions, createTransaction } = require("./transaction");
const { getUsers, registerUser, loginUser, forgetUserPassword, resetUserPassword, updateUserPushToken, removeUserPushToken, getPayments, getUserById, requestPayment, verifyUser, addBank, sendVoletPayment, applyAgent, toggleSavingsPlan, getUsersByMobile, editUserInfo } = require("./user");
const { sendNewTAC, sendExistingTAC, sendUserTAC, checkTAC, checkUserTAC } = require("./tac");
const { getVolets, createVolet, calculateVolet } = require("./volet");
const { getVouchers, createVoucher, redeemVoucher } = require("./voucher");
const { toggleBank, toggleBusinessCategory, toggleBusinessType, toggleCurrency, togglePaymentMethod } = require("./toggle");
const { createPayment, createFakePayment, billplz_payment } = require("./payment");

const { newTAC, existingTAC, userTAC } = require('../tac');
const { adminAuth, userAuth, merchantAuth, anyAuth } = require('../auth');

const catchAsyncErrors = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((e) => {
            next(e);
        });
    };
};
let upload = multer({ dest: 'images/'});
let imageUpload = upload.single('image');

router.get ('/admin',                adminAuth, catchAsyncErrors(getAdmins));
router.post('/admin',                adminAuth, catchAsyncErrors(createAdmin));
router.post('/admin/login',                     catchAsyncErrors(loginAdmin));
router.get ('/admin/me',             adminAuth, catchAsyncErrors(verifyAdmin));
router.post('/admin/changePassword', adminAuth, catchAsyncErrors(changeAdminPassword));
router.post('/admin/changeEmail',    adminAuth, catchAsyncErrors(changeAdminEmail));

router.get ('/bank', adminAuth,      catchAsyncErrors(getBanks));
router.post('/bank', adminAuth,      catchAsyncErrors(createBank));
router.get ('/bank/active', anyAuth, catchAsyncErrors(getActiveBanks));

router.get ('/business',                         adminAuth, catchAsyncErrors(getBusinesses));
router.post('/business',                                    catchAsyncErrors(registerBusiness));
router.get ('/business/registrationInformation', adminAuth, catchAsyncErrors(getBusinessRegistrationInformation));
router.post('/business/approve',                 adminAuth, catchAsyncErrors(approveBusiness));
router.post('/business/decline',                 adminAuth, catchAsyncErrors(declineBusiness));
router.post('/business/info',                    adminAuth, catchAsyncErrors(updateBusinessInfo));
router.get ('/business/getTypes',                adminAuth, catchAsyncErrors(getBusinessTypes2));

router.get ('/business_category',          adminAuth, catchAsyncErrors(getBusinessCategories));
router.post('/business_category',          adminAuth, catchAsyncErrors(createBusinessCategory));
router.post('/business_category/business', adminAuth, catchAsyncErrors(getBusinessCategory));

router.get ('/business_type', adminAuth, catchAsyncErrors(getBusinessTypes));
router.post('/business_type', adminAuth, catchAsyncErrors(createBusinessType));

router.get ('/currency', adminAuth, catchAsyncErrors(getCurrencies));
router.post('/currency', adminAuth, catchAsyncErrors(createCurrency));
router.post('/currency/convert',     catchAsyncErrors(convertCurrency));

router.get ('/feedback', adminAuth, catchAsyncErrors(getFeedback));
router.post('/feedback', adminAuth, catchAsyncErrors(createFeedback));

router.post('/item/add',      adminAuth, catchAsyncErrors(addItem));
router.post('/item/remove',   adminAuth, catchAsyncErrors(removeItem));
router.post('/item/business', adminAuth, catchAsyncErrors(getBusinessItems));

router.get ('/merchants',               adminAuth, catchAsyncErrors(getMerchants));
router.post('/merchants/id',            adminAuth, catchAsyncErrors(getMerchantById));
router.post('/merchants',                          catchAsyncErrors(registerMerchant));
router.post('/merchants/login',                    catchAsyncErrors(loginMerchant));
router.post('/merchants/tempPassword',  adminAuth, catchAsyncErrors(createMerchantTempPassword));
router.post('/merchants/resetPassword', adminAuth, catchAsyncErrors(resetMerchantPassword));
router.post('/merchants/updatePush',    adminAuth, catchAsyncErrors(updateMerchantPushToken));
router.post('/merchants/removePush',    adminAuth, catchAsyncErrors(removeMerchantPushToken));

router.post('/payment_method/', adminAuth, catchAsyncErrors(createPaymentMethod));
router.get ('/payment_method/', adminAuth, catchAsyncErrors(getPaymentMethods));

router.get ('/push', adminAuth, catchAsyncErrors(getPush));
router.post('/push', adminAuth, catchAsyncErrors(createPush));

router.get ('/static',          adminAuth, catchAsyncErrors(getStaticPages));
router.post('/static/faq',      adminAuth, catchAsyncErrors(editFaq));
router.post('/static/policies', adminAuth, catchAsyncErrors(editPolicies));

router.get ('/transaction/:user_type', adminAuth, catchAsyncErrors(getTransactions));

router.get ('/users',                    adminAuth,              catchAsyncErrors(getUsers));
router.post('/users/login',                                      catchAsyncErrors(loginUser));
router.post('/users/forget-password',               existingTAC, catchAsyncErrors(forgetUserPassword));
router.post('/users/reset-password',     userAuth,  userTAC,     catchAsyncErrors(resetUserPassword));
router.post('/users/updatePush',         adminAuth,              catchAsyncErrors(updateUserPushToken));
router.post('/users/removePush',         adminAuth,              catchAsyncErrors(removeUserPushToken));
router.get ('/users/me',                 userAuth,               catchAsyncErrors(verifyUser));
router.post('/users/add-bank',           userAuth,               catchAsyncErrors(addBank));
router.post('/users/get-by-contact',     userAuth,               catchAsyncErrors(getUsersByMobile));
router.post('/users/send-volet-payment', userAuth,               catchAsyncErrors(sendVoletPayment));
router.post('/users/request-payment',    userAuth,               catchAsyncErrors(requestPayment));
router.get ('/users/get-payments',       userAuth,               catchAsyncErrors(getPayments));
router.post('/users/edit-profile',       userAuth, imageUpload,  catchAsyncErrors(editUserInfo));
router.post('/users/apply-agent',        userAuth,               catchAsyncErrors(applyAgent));

//router.get ('/agents',         adminAuth, catchAsyncErrors(getAgents));
//router.post('/agents/approve', adminAuth, catchAsyncErrors(approveAgent));
//router.post('/agents/decline', adminAuth, catchAsyncErrors(declineAgent));

router.get('/users/:id',                 adminAuth,              catchAsyncErrors(getUserById));
router.post('/users',                               newTAC,      catchAsyncErrors(registerUser));

router.post('/tac/new',                                     catchAsyncErrors(sendNewTAC));
router.post('/tac/contact',                                 catchAsyncErrors(sendExistingTAC));
router.post('/tac/user',                    userAuth,       catchAsyncErrors(sendUserTAC));
router.post('/tac/check',                                   catchAsyncErrors(checkTAC));
router.post('/tac/check-user',              userAuth,       catchAsyncErrors(checkUserTAC));

router.get ('/volet',                       adminAuth,      catchAsyncErrors(getVolets));
router.post('/volet',                       adminAuth,      catchAsyncErrors(createVolet));
router.post('/volet/id',                    adminAuth,      catchAsyncErrors(calculateVolet));

router.get ('/vouchers',                    adminAuth,      catchAsyncErrors(getVouchers));
router.post('/vouchers',                    adminAuth,      catchAsyncErrors(createVoucher));
router.post('/vouchers/redeem',             adminAuth,      catchAsyncErrors(redeemVoucher));

router.post('/bank/toggle',                 adminAuth,      catchAsyncErrors(toggleBank));
router.post('/business_category/toggle',    adminAuth,      catchAsyncErrors(toggleBusinessCategory));
router.post('/business_type/toggle',        adminAuth,      catchAsyncErrors(toggleBusinessType));
router.post('/currency/toggle',             adminAuth,      catchAsyncErrors(toggleCurrency));
router.post('/payment_method/toggle',       adminAuth,      catchAsyncErrors(togglePaymentMethod));

router.post('/payment',                     userAuth,       catchAsyncErrors(createPayment));
router.post('/payment/fake',                userAuth,       catchAsyncErrors(createFakePayment));
router.post('/payment/billplz',                             catchAsyncErrors(billplz_payment));


module.exports = router;