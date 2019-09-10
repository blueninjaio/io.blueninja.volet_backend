const {Business, Currency, Bank, BusinessCategory, BusinessType} = require('../../models');

module.exports = {
    getBusinesses: async (req, res) => {
        let businesses = await Business.find({});
        return res.ok('Businesses received', {
            businesses: businesses
        });
    },
    registerBusiness: async (req, res) => {
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
    getBusinessRegistrationInformation: async (req, res) => {
        let info = {
            currency: await Currency.find({}),
            bank: await Bank.find({}),
            business_category: await BusinessCategory.find({}),
            business_type: await BusinessType.find({})
        };

        return res.ok('Businesses registration information received', {
            info: info
        });
    },
    approveBusiness: async (req, res) => {
        let { _id } = req.body;

        let update = {
            isPending: false,
            isApproved: true
        };

        await Business.updateOne({ _id }, update);
        return res.ok('Business Approved.');
    },
    declineBusiness: async (req, res) => {
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
    updateBusinessInfo: async (req, res) => {
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
    getBusinessTypes2: async (req, res) => {
        let types = await BusinessType.find({});

        let businesses = await Business.find({});
        return res.ok('Categories received', {
            categories: types,
            businesses: businesses
        });
    }
};