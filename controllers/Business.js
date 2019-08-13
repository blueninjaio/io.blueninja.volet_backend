const Business = require('../models/Business');
const Currency = require('../models/Currency');
const Bank = require('../models/Bank');
const PaymentMethod = require('../models/PaymentMethod');
const Category = require('../models/BusinessCategory');
const Types = require('../models/BusinessType');
const CategoryType = require('../models/CategoryType');

module.exports = {
    getAll: async (req, res) => {
        let businesses = await Business.find({});
        return res.ok('Businesses received', {
            businesses: businesses
        });
    },
    register: async (req, res) => {
        let {
            merchant_id,
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
        } = req.body;


        let newBusiness = {
            merchant_id,
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
        };


        let business = await Business.create(newBusiness);
        return res.ok('Successfully created the business request.', {
            business: business
        });
    },
    registrationInformation: async (req, res) => {
        let info = {
            currency: await Currency.find({}),
            payment_method: await PaymentMethod.find({}),
            bank: await Bank.find({}),
            business_category: await Category.find({}),
            business_type: await Types.find({})
        };

        return res.ok('Businesses registration information received', {
            info: info
        });
    },
    approve: async (req, res) => {
        let { _id } = req.body;

        let update = {
            isPending: false,
            isApproved: true
        };

        await Business.updateOne({ _id }, update);
        return res.ok('Business Approved.');
    },
    decline: async (req, res) => {
        let { _id } = req.body;

        let update = {
            isPending: false,
            isDeclined: true
        };

        let business = await Business.updateOne({ _id }, update);
        return res.ok('Business Declined.', {
            business: business
        });
    },
    updateInfo: async (req, res) => {
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
        } = req.body;

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
        };

        await Business.updateOne({ _id }, update);
        return res.ok('Business Information Updated.');
    },
    getTypes: async (req, res) => {
        let categories = await CategoryType.find({});
        let businesses = await Business.find({});
        return res.ok('Categories received', {
            categories: categories,
            businesses: businesses
        });
    }
};