var express = require('express')
var router = express.Router()
var Business = require('./Business')
var Currency = require('../currency/Currency')
var Bank = require('../bank/Bank')
var PaymentMethod = require('../payment_method/PaymentMethod')
var Category = require('../business_category/BusinessCategory')
var Types = require('../business_type/BusinessType')

/**
|--------------------------------------------------
| Mobile: REGISTRATION (POST)
|--------------------------------------------------
*/
router.post('/', (req, res) => {
    let { 
        contact,
        f_name, 
        l_name,
        email,
        identification, 
        identification_image, 
        company_name, 
        branding, 
        type_of_business, 
        business_category, 
        business_email, 
        business_contact, 
        business_number, 
        tax_number, 
        legal_name, 
        payment_method, 
        bank, 
        branch, 
        account_number, 
        currency, 
        billing_address, 
        postcode, 
        state, 
        country
    } = req.body


    let newBusiness = {
        merchant_id: merchant._id,
        contact,
        f_name, 
        l_name,
        email,
        identification, 
        identification_image, 
        company_name, 
        branding, 
        type_of_business, 
        business_category, 
        business_email, 
        business_contact, 
        business_number, 
        tax_number, 
        legal_name, 
        payment_method, 
        bank, 
        branch, 
        account_number, 
        currency, 
        billing_address, 
        postcode,
        state,
        country,
        isPending: true,
        isApproved: false,
        isDeclined: false,
        store_name: '',
        store_number: '',
        store_description: '',
        sunday: {
            start: '',
            end: ''
        },
        monday: {
            start: '',
            end: ''
        },
        tuesday: {
            start: '',
            end: ''
        },
        wednesday: {
            start: '',
            end: ''
        },
        thursday: {
            start: '',
            end: ''
        },
        friday: {
            start: '',
            end: ''
        },
        saturday: {
            start: '',
            end: ''
        }
    }
    

    Business.create(newBusiness, (err, business) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was an error adding you. Please try again in a bit."
            })
        else
            return res.status(200).send({
                success: true,
                business,
                message: "Success: Successfully created the business request."
            })
    })

})

/**
|--------------------------------------------------
| Mobile: Registration Information (GET)
|--------------------------------------------------
*/
router.get('/registrationInformation', async(req, res) => {

    let info = {}

    Currency.find({}, (err, currency) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else{
            info.currency = currency
        }
    })

    PaymentMethod.find({}, (err, payment_method) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else{
            info.payment_method = payment_method
        }
    })

    Bank.find({}, (err, bank) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else{
            info.bank = bank
        }
    })

    Category.find({}, (err, business_category) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else{
            info.business_category = business_category
        }
    })

    Types.find({}, (err, business_type) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else{
            info.business_type = business_type
        }
    })

    return res.status(200).send({
        success: true,
        info,
        message: "Success: Businesses registration information received"
    })   
})


/**
|--------------------------------------------------
| Admin: Approve Business (POST)
|--------------------------------------------------
*/
router.post('/approve', (req, res) => {
    let { 
        _id
    } = req.body

    update = {
        isPending: false,
        isApproved: true
    }

    Business.updateOne({_id}, update, (err, business) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else{
            return res.status(200).send({
                success: true,
                message: "Success: Business Approved."
            })
        }
    })
})

/**
|--------------------------------------------------
| Admin: Decline Business (POST)
|--------------------------------------------------
*/
router.post('/decline', (req, res) => {
    let { 
        _id
    } = req.body

    update = {
        isPending: false,
        isDeclined: true
    }

    Business.updateOne({_id}, update, (err, business) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else{
            return res.status(200).send({
                success: true,
                business,
                message: "Success: Business Declined."
            })
        }
    })
})

/**
|--------------------------------------------------
| POST: Updating Store Information
|--------------------------------------------------
*/
router.post('/info', (req, res) => {
    let { 
        _id, 
        store_name,
        store_number, 
        store_description, 
        sunday,
        monday, 
        tuesday, 
        wednesday, 
        thursday, 
        friday, 
        saturday
    } = req.body

    let update = {
        store_name,
        store_number, 
        store_description, 
        sunday,
        monday, 
        tuesday, 
        wednesday, 
        thursday, 
        friday, 
        saturday
    }
    
    Business.updateOne({_id}, update, (err, business) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: The business id sent cannot be updated. Please check if it is valid."
            })

        else
            return res.status(200).send({
                success: true,
                message: "Success: Business Information Updated."
            })
    })
})

/**
|--------------------------------------------------
| Admin: All Businesses (GET)
|--------------------------------------------------
*/
router.get('/', (req, res) => {
    Business.find({}, (err, businesses) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else
            return res.status(200).send({
                success: true,
                businesses,
                message: "Success: Businesses received"
            })
    })
})


module.exports = router